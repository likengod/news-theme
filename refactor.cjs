const fs = require('fs');
const path = require('path');

const filePath = String.raw`c:\Users\gorillatech\Music\TodayTripura\src\components\admin\articles\RichEditor.tsx`;
const outDir = String.raw`c:\Users\gorillatech\Music\TodayTripura\src\components\admin\articles\RichEditor`;

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
}

let content = fs.readFileSync(filePath, 'utf-8');

const startMarker = "{/* TOOLBAR ROW 1: Typography, Headings, Fonts, Sizes, Inline Styles, Colors */}";
const endMarker = "{/* EDITOR AREA */}";

const tStart = content.indexOf(startMarker);
const tEnd = content.indexOf(endMarker);

let toolbarJsx = content.substring(tStart, tEnd).trim();

const imageUploadStart = toolbarJsx.indexOf('<input\n          ref={imgRef}');
const imageUploadEnd = toolbarJsx.indexOf('/>', imageUploadStart) + 2;

const imageUploadJsx = toolbarJsx.substring(imageUploadStart, imageUploadEnd);

toolbarJsx = toolbarJsx.replace(imageUploadJsx, '<ImageUpload imgRef={imgRef} uploadImage={uploadImage} />');

const toolbarImports = `import React from "react";
import {
  Undo, Redo, Heading2, Heading3, Heading4, Bold, Italic, Underline,
  Strikethrough, Subscript, Superscript, RemoveFormatting, Code2, Highlighter,
  ChevronDown, Pipette, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Minus, Link2, Table as TableIcon, Image as ImageIcon,
  Upload, Youtube, Facebook, Video, Maximize2, Minimize2, FileText,
} from "lucide-react";
import { ImageUpload } from "./ImageUpload";

interface ToolbarProps {
  mode: "visual" | "plain";
  setMode: (mode: "visual" | "plain") => void;
  exec: (cmd: string, val?: string) => void;
  formatBlock: (tag: string) => void;
  setFontFamily: (f: string) => void;
  setFontSize: (px: string) => void;
  fontOptions: string[];
  currentSize: string;
  sizes: string[];
  applyTextColor: (color: string) => void;
  applyHighlightColor: (color: string) => void;
  insertHTML: (html: string) => void;
  insertImage: () => void;
  imgRef: React.RefObject<HTMLInputElement>;
  uploadImage: (f?: File | null) => void;
  insertYouTube: () => void;
  insertFacebook: () => void;
  insertVideoUrl: () => void;
  insertLink: () => void;
  insertDivider: () => void;
  insertQuote: () => void;
  insertTable: () => void;
  isFullscreen: boolean;
  setIsFullscreen: (val: boolean) => void;
  words: number;
  saveSelection: () => void;
  emit: () => void;
  textColorOpen: boolean;
  setTextColorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  highlightOpen: boolean;
  setHighlightOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeTextColor: string;
  activeHighlightColor: string;
  textColorRef: React.RefObject<HTMLDivElement>;
  highlightRef: React.RefObject<HTMLDivElement>;
  TEXT_PALETTE_ROWS: string[][];
  HIGHLIGHT_PALETTE_ROWS: string[][];
  Btn: React.FC<{
    onClick: () => void;
    title: string;
    children: React.ReactNode;
    disabled?: boolean;
  }>;
  Sep: React.FC;
}

export function Toolbar({
  mode, setMode, exec, formatBlock, setFontFamily, setFontSize,
  fontOptions, currentSize, sizes, applyTextColor, applyHighlightColor,
  insertHTML, insertImage, imgRef, uploadImage, insertYouTube, insertFacebook,
  insertVideoUrl, insertLink, insertDivider, insertQuote, insertTable,
  isFullscreen, setIsFullscreen, words, saveSelection, emit,
  textColorOpen, setTextColorOpen, highlightOpen, setHighlightOpen,
  activeTextColor, activeHighlightColor, textColorRef, highlightRef,
  TEXT_PALETTE_ROWS, HIGHLIGHT_PALETTE_ROWS, Btn, Sep
}: ToolbarProps) {
  return (
    <>
      ${toolbarJsx.replace(/\n/g, '\n      ')}
    </>
  );
}
`;

fs.writeFileSync(path.join(outDir, "Toolbar.tsx"), toolbarImports, "utf-8");

const imageUploadFileContent = `import React from "react";

interface ImageUploadProps {
  imgRef: React.RefObject<HTMLInputElement>;
  uploadImage: (f?: File | null) => void;
}

export function ImageUpload({ imgRef, uploadImage }: ImageUploadProps) {
  return (
    <input
      ref={imgRef}
      type="file"
      accept="image/*"
      hidden
      onChange={(e) => {
        uploadImage(e.target.files?.[0]);
        if (imgRef.current) imgRef.current.value = "";
      }}
    />
  );
}
`;

fs.writeFileSync(path.join(outDir, "ImageUpload.tsx"), imageUploadFileContent, "utf-8");

const bubbleMenuFileContent = `import React from "react";

export function BubbleMenu() {
  return null;
}

export function FloatingMenu() {
  return null;
}
`;
fs.writeFileSync(path.join(outDir, "BubbleMenu.tsx"), bubbleMenuFileContent, "utf-8");

const toolbarComponentCall = `<Toolbar
        mode={mode}
        setMode={setMode}
        exec={exec}
        formatBlock={formatBlock}
        setFontFamily={setFontFamily}
        setFontSize={setFontSize}
        fontOptions={fontOptions}
        currentSize={currentSize}
        sizes={sizes}
        applyTextColor={applyTextColor}
        applyHighlightColor={applyHighlightColor}
        insertHTML={insertHTML}
        insertImage={insertImage}
        imgRef={imgRef}
        uploadImage={uploadImage}
        insertYouTube={insertYouTube}
        insertFacebook={insertFacebook}
        insertVideoUrl={insertVideoUrl}
        insertLink={insertLink}
        insertDivider={insertDivider}
        insertQuote={insertQuote}
        insertTable={insertTable}
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
        words={words}
        saveSelection={saveSelection}
        emit={emit}
        textColorOpen={textColorOpen}
        setTextColorOpen={setTextColorOpen}
        highlightOpen={highlightOpen}
        setHighlightOpen={setHighlightOpen}
        activeTextColor={activeTextColor}
        activeHighlightColor={activeHighlightColor}
        textColorRef={textColorRef}
        highlightRef={highlightRef}
        TEXT_PALETTE_ROWS={TEXT_PALETTE_ROWS}
        HIGHLIGHT_PALETTE_ROWS={HIGHLIGHT_PALETTE_ROWS}
        Btn={Btn}
        Sep={Sep}
      />
      <BubbleMenu />
      <FloatingMenu />`;

let newContent = content.replace(content.substring(tStart, tEnd).trim(), toolbarComponentCall);

const importInsertPos = newContent.indexOf('import { loadFontConfig }');
const imports = `import { Toolbar } from "./RichEditor/Toolbar";\nimport { BubbleMenu, FloatingMenu } from "./RichEditor/BubbleMenu";\n`;
newContent = newContent.slice(0, importInsertPos) + imports + newContent.slice(importInsertPos);

fs.writeFileSync(filePath, newContent, "utf-8");
console.log("Done");
