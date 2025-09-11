/**
 * 本地開發伺服器
 * 簡易的 HTTP 伺服器用於本地開發和測試
 * 使用方法: node server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// 定義端口
const PORT = process.env.PORT || 3000;

// 定義 MIME 類型
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
};

// 創建伺服器
const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // 解析 URL
  let parsedUrl = url.parse(req.url);

  // 將 URL 轉換為文件系統路徑
  let pathname = path.join(__dirname, parsedUrl.pathname);

  // 默認文件
  if (pathname.endsWith('/')) {
    pathname = path.join(pathname, 'index.html');
  }

  // 檢查文件是否存在
  fs.stat(pathname, (err, stats) => {
    if (err) {
      // 如果文件不存在，嘗試提供 new-index.html
      if (pathname.endsWith('index.html')) {
        let newIndexPath = path.join(__dirname, 'new-index.html');

        fs.stat(newIndexPath, (err, stats) => {
          if (err) {
            res.statusCode = 404;
            res.end(`File ${pathname} not found!`);
            return;
          }

          // 提供 new-index.html 文件
          fs.readFile(newIndexPath, (err, data) => {
            if (err) {
              res.statusCode = 500;
              res.end(`Error getting file: ${err}.`);
            } else {
              res.setHeader('Content-type', 'text/html');
              res.end(data);
            }
          });
        });
      } else {
        res.statusCode = 404;
        res.end(`File ${pathname} not found!`);
      }
      return;
    }

    // 如果是目錄，查找 index.html
    if (stats.isDirectory()) {
      pathname = path.join(pathname, 'index.html');
      fs.stat(pathname, (err, stats) => {
        if (err) {
          res.statusCode = 404;
          res.end(`File ${pathname} not found!`);
          return;
        }

        // 提供目錄中的 index.html
        fs.readFile(pathname, (err, data) => {
          if (err) {
            res.statusCode = 500;
            res.end(`Error getting file: ${err}.`);
          } else {
            res.setHeader('Content-type', 'text/html');
            res.end(data);
          }
        });
      });
      return;
    }

    // 讀取請求的文件
    fs.readFile(pathname, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end(`Error getting file: ${err}.`);
      } else {
        // 根據文件擴展名設置 MIME 類型
        const ext = path.extname(pathname);
        res.setHeader('Content-type', MIME_TYPES[ext] || 'text/plain');

        // 發送文件
        res.end(data);
      }
    });
  });
});

// 啟動伺服器
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`新版一頁式網站: http://localhost:${PORT}/new-index.html`);
  console.log('Press Ctrl+C to stop the server');
});
