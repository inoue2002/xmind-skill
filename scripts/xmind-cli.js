#!/usr/bin/env node
/**
 * XMind CLI - Create, read, and edit XMind files using official SDK
 *
 * Usage:
 *   node xmind-cli.js create <output.xmind> --root "Root Topic"
 *   node xmind-cli.js show <file.xmind>
 *   node xmind-cli.js add <file.xmind> --parent "Parent" --topic "New Topic" [--note "Note text"]
 *   node xmind-cli.js markdown <file.xmind> [--style bullets|headers]
 */

const { Workbook, Topic, Zipper } = require('xmind');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

// ============ Reader Functions (custom implementation) ============

function readXMind(filePath) {
  const zip = new AdmZip(filePath);
  const contentEntry = zip.getEntry('content.json');
  if (!contentEntry) {
    throw new Error('Not a valid XMind Zen file (no content.json)');
  }
  return JSON.parse(contentEntry.getData().toString('utf8'));
}

function findTopic(topic, title) {
  if (topic.title === title) return topic;
  const children = topic.children?.attached || [];
  for (const child of children) {
    const found = findTopic(child, title);
    if (found) return found;
  }
  return null;
}

function topicToTree(topic, level = 0) {
  const indent = '  '.repeat(level);
  const prefix = level > 0 ? '- ' : '';
  let lines = [`${indent}${prefix}${topic.title || 'Untitled'}`];

  // Show note if exists
  if (topic.notes?.plain?.content) {
    const noteIndent = '  '.repeat(level + 1);
    lines.push(`${noteIndent}> ${topic.notes.plain.content}`);
  }

  const children = topic.children?.attached || [];
  for (const child of children) {
    lines.push(topicToTree(child, level + 1));
  }
  return lines.join('\n');
}

function topicToMarkdown(topic, level = 1, style = 'headers') {
  const lines = [];
  const title = topic.title || 'Untitled';

  if (style === 'headers' && level <= 6) {
    lines.push(`${'#'.repeat(level)} ${title}`);
    lines.push('');
  } else {
    const indent = '  '.repeat(style === 'headers' ? level - 7 : level - 1);
    lines.push(`${indent}- ${title}`);
  }

  // Add note if exists
  if (topic.notes?.plain?.content) {
    lines.push(topic.notes.plain.content);
    lines.push('');
  }

  const children = topic.children?.attached || [];
  for (const child of children) {
    lines.push(topicToMarkdown(child, level + 1, style));
  }

  return lines.join('\n');
}

// ============ Commands ============

async function cmdCreate(outputPath, rootTitle) {
  const workbook = new Workbook();
  const sheet = workbook.createSheet('Sheet 1', rootTitle);
  const topic = new Topic({ sheet });

  const outputDir = path.dirname(path.resolve(outputPath));
  const filename = path.basename(outputPath, '.xmind');

  const zipper = new Zipper({ path: outputDir, workbook, filename });
  await zipper.save();

  console.log(`Created: ${outputPath}`);
  console.log(`Root topic: ${rootTitle}`);
}

function cmdShow(filePath) {
  const content = readXMind(filePath);

  for (const sheet of content) {
    console.log(`=== ${sheet.title || 'Sheet'} ===`);
    const rootTopic = sheet.rootTopic;
    if (rootTopic) {
      console.log(topicToTree(rootTopic));
    }
    console.log('');
  }
}

function cmdMarkdown(filePath, style = 'headers') {
  const content = readXMind(filePath);

  for (const sheet of content) {
    if (content.length > 1) {
      console.log(`# ${sheet.title || 'Sheet'}\n`);
    }
    const rootTopic = sheet.rootTopic;
    if (rootTopic) {
      console.log(topicToMarkdown(rootTopic, 1, style));
    }
  }
}

async function cmdAdd(filePath, parentTitle, newTitle, noteText = null) {
  // Read existing file
  const content = readXMind(filePath);

  // Create new workbook with existing structure
  const workbook = new Workbook();

  for (const sheetData of content) {
    const sheet = workbook.createSheet(sheetData.title || 'Sheet 1', sheetData.rootTopic?.title || 'Central Topic');
    const topic = new Topic({ sheet });

    // Rebuild structure recursively
    const rebuildTopics = (topicData, parentCid = null) => {
      const children = topicData.children?.attached || [];
      for (const child of children) {
        if (parentCid) {
          topic.on(parentCid);
        }
        topic.add({ title: child.title });

        // Add note if exists
        if (child.notes?.plain?.content) {
          topic.on(topic.cid()).note(child.notes.plain.content);
        }

        // Recursively add children
        if (child.children?.attached?.length > 0) {
          rebuildTopics(child, topic.cid());
        }
      }
    };

    // Add note to root if exists
    if (sheetData.rootTopic?.notes?.plain?.content) {
      topic.note(sheetData.rootTopic.notes.plain.content);
    }

    rebuildTopics(sheetData.rootTopic);

    // Add new topic
    const parentCid = findParentCid(topic, parentTitle, sheetData.rootTopic);
    if (parentCid) {
      topic.on(parentCid).add({ title: newTitle });
      if (noteText) {
        topic.on(topic.cid()).note(noteText);
      }
    } else if (sheetData.rootTopic?.title === parentTitle) {
      topic.on().add({ title: newTitle });
      if (noteText) {
        topic.on(topic.cid()).note(noteText);
      }
    } else {
      console.error(`Error: Parent topic '${parentTitle}' not found`);
      process.exit(1);
    }
  }

  const outputDir = path.dirname(path.resolve(filePath));
  const filename = path.basename(filePath, '.xmind');

  const zipper = new Zipper({ path: outputDir, workbook, filename });
  await zipper.save();

  console.log(`Added '${newTitle}' under '${parentTitle}'`);
  if (noteText) {
    console.log(`  Note: ${noteText}`);
  }
}

function findParentCid(topic, parentTitle, rootTopic) {
  // Simple approach: find by title match in the cid system
  // This is a limitation - we need to track cids during rebuild
  const cids = [];
  const collectCids = (topicData, level = 0) => {
    if (topicData.title === parentTitle && level > 0) {
      return topicData.title;
    }
    const children = topicData.children?.attached || [];
    for (const child of children) {
      const found = collectCids(child, level + 1);
      if (found) return found;
    }
    return null;
  };

  const title = collectCids(rootTopic);
  if (title) {
    return topic.cid(title);
  }
  return null;
}

// ============ Main ============

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    console.log(`XMind CLI - Create and edit XMind files

Usage:
  node xmind-cli.js create <output.xmind> --root "Root Topic"
  node xmind-cli.js show <file.xmind>
  node xmind-cli.js markdown <file.xmind> [--style headers|bullets]
  node xmind-cli.js add <file.xmind> --parent "Parent" --topic "New" [--note "Note"]

Commands:
  create    Create a new XMind file
  show      Display XMind structure as tree
  markdown  Convert XMind to Markdown
  add       Add a topic to existing file
`);
    process.exit(0);
  }

  const getArg = (flag) => {
    const idx = args.indexOf(flag);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
  };

  try {
    switch (command) {
      case 'create': {
        const outputPath = args[1];
        const rootTitle = getArg('--root') || 'Central Topic';
        if (!outputPath) {
          console.error('Error: Output path required');
          process.exit(1);
        }
        await cmdCreate(outputPath, rootTitle);
        break;
      }

      case 'show': {
        const filePath = args[1];
        if (!filePath) {
          console.error('Error: File path required');
          process.exit(1);
        }
        cmdShow(filePath);
        break;
      }

      case 'markdown': {
        const filePath = args[1];
        const style = getArg('--style') || 'headers';
        if (!filePath) {
          console.error('Error: File path required');
          process.exit(1);
        }
        cmdMarkdown(filePath, style);
        break;
      }

      case 'add': {
        const filePath = args[1];
        const parentTitle = getArg('--parent');
        const newTitle = getArg('--topic');
        const noteText = getArg('--note');

        if (!filePath || !parentTitle || !newTitle) {
          console.error('Error: File path, --parent, and --topic required');
          process.exit(1);
        }
        await cmdAdd(filePath, parentTitle, newTitle, noteText);
        break;
      }

      default:
        console.error(`Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
