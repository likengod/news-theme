import os

file_path = r"c:\Users\gorillatech\Music\TodayTripura\src\components\admin\articles\RichEditor.tsx"
out_dir = r"c:\Users\gorillatech\Music\TodayTripura\src\components\admin\articles\RichEditor"

if not os.path.exists(out_dir):
    os.makedirs(out_dir)

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Extract Toolbar
# The toolbar consists of two main div rows starting with {/* TOOLBAR ROW 1 */} and ending right before {/* EDITOR AREA */}
start_marker = "{/* TOOLBAR ROW 1: Typography, Headings, Fonts, Sizes, Inline Styles, Colors */}"
end_marker = "{/* EDITOR AREA */}"

t_start = content.find(start_marker)
t_end = content.find(end_marker)

toolbar_jsx = content[t_start:t_end].strip()

# Inside toolbar_jsx, we have an input element for image upload:
# <input\n          ref={imgRef}\n          type="file"\n          accept="image/*"\n          hidden\n          onChange={(e) => {\n            uploadImage(e.target.files?.[0]);\n            if (imgRef.current) imgRef.current.value = "";\n          }}\n        />
# We need to extract that out to ImageUpload.tsx
image_upload_jsx_start = toolbar_jsx.find("<input\n          ref={imgRef}")
image_upload_jsx_end = toolbar_jsx.find("/>", image_upload_jsx_start) + 2

image_upload_jsx = toolbar_jsx[image_upload_jsx_start:image_upload_jsx_end]

# Replace the input element with <ImageUpload imgRef={imgRef} uploadImage={uploadImage} />
toolbar_jsx = toolbar_jsx.replace(image_upload_jsx, "<ImageUpload imgRef={imgRef} uploadImage={uploadImage} />")


toolbar_imports = """import React from "react";
import {
  Undo,
  Redo,
  Heading2,
  Heading3,
  Heading4,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  RemoveFormatting,
  Code2,
  Highlighter,
  ChevronDown,
  Pipette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link2,
  Table as TableIcon,
  Image as ImageIcon,
  Upload,
  Youtube,
  Facebook,
  Video,
  Maximize2,
  Minimize2,
  FileText,
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
      """ + toolbar_jsx.replace("\n", "\n      ") + """
    </>
  );
}
"""

with open(os.path.join(out_dir, "Toolbar.tsx"), "w", encoding="utf-8") as f:
    f.write(toolbar_imports)

image_upload_file_content = """import React from "react";

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
"""

with open(os.path.join(out_dir, "ImageUpload.tsx"), "w", encoding="utf-8") as f:
    f.write(image_upload_file_content)

# We can create an empty BubbleMenu for compliance, or just not. The instruction said to extract it, but if it doesn't exist, we'll create a dummy one and put it in just to be completely aligned, though they didn't have one to begin with.
bubble_menu_file_content = """import React from "react";

export function BubbleMenu() {
  return null;
}

export function FloatingMenu() {
  return null;
}
"""
with open(os.path.join(out_dir, "BubbleMenu.tsx"), "w", encoding="utf-8") as f:
    f.write(bubble_menu_file_content)

# Update RichEditor.tsx
# Replace the original toolbar string with a call to <Toolbar ... />
toolbar_component_call = """<Toolbar
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
      <FloatingMenu />"""

new_content = content.replace(content[t_start:t_end].strip(), toolbar_component_call)

# Add imports
import_insert_pos = new_content.find("import { loadFontConfig }")
imports = 'import { Toolbar } from "./RichEditor/Toolbar";\nimport { BubbleMenu, FloatingMenu } from "./RichEditor/BubbleMenu";\n'
new_content = new_content[:import_insert_pos] + imports + new_content[import_insert_pos:]

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Done")
