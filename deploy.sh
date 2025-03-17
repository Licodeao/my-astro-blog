#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 定义颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 文章目录
ARTICLE_DIR="./src/content/articles"

if [ ! -d "$ARTICLE_DIR" ]; then
    echo -e "${RED}错误: 目录 $ARTICLE_DIR 不存在${NC}"
    exit 1
fi

process_files() {
  local dir="$1"
  for item in "$dir"/*; do
    if [ -d "$item" ]; then
      echo -e "${BLUE}处理目录：$(basename "$item")${NC}"
      process_files "$item"
    elif [ -f "$item" ]; then
      if grep -q "tags:" "$item"; then
        echo -e "${GREEN}上传完整文章：$item${NC}"
        git add "$item"
      else
        echo -e "${RED}过滤非完整文章：$item${NC}"
        git rm --cached "$item" 2>/dev/null || true
      fi
    fi
  done
}

process_files "$ARTICLE_DIR"

git commit -m 'feat: update blog'

git push origin master -f