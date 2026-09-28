/**
 * Base HTML wrapper for transactional emails.
 * Uses inline CSS for maximum compatibility.
 */
export const baseTemplate = (content: string, title: string): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;700&display=swap');
    
    body {
      margin: 0;
      padding: 0;
      background-color: #151417;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      color: #F7F3EA;
      -webkit-font-smoothing: antialiased;
    }
    
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #151417;
      padding: 40px 0;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #1C1B20;
      border: 1px solid #2A2832;
      border-radius: 12px;
      overflow: hidden;
    }
    
    .content {
      padding: 40px;
    }
    
    .header {
      margin-bottom: 30px;
      text-align: center;
    }
    
    .logo {
      font-size: 22px;
      font-weight: bold;
      letter-spacing: 2px;
      color: #C9A227;
      text-decoration: none;
      text-transform: uppercase;
    }
    
    h1 {
      font-size: 22px;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 20px;
      color: #F7F3EA;
    }
    
    p {
      font-size: 15px;
      line-height: 1.6;
      margin-top: 0;
      margin-bottom: 20px;
      color: #F7F3EA;
    }
    
    .muted {
      color: #8C8A94;
    }
    
    .button-container {
      margin: 30px 0;
      text-align: center;
    }
    
    .button {
      display: inline-block;
      background-color: #9E1B32;
      color: #F7F3EA !important;
      padding: 12px 24px;
      text-decoration: none;
      font-weight: bold;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-radius: 8px;
      border: 1px solid rgba(201, 162, 39, 0.4);
    }
    
    .footer {
      padding: 20px 40px;
      text-align: center;
      font-size: 12px;
      color: #8C8A94;
      border-top: 1px solid #2A2832;
      background-color: #151417;
    }
    
    .footer a {
      color: #C9A227;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="content">
        <div class="header">
          <a href="https://meridas.ai" class="logo">MERIDAS</a>
        </div>
        ${content}
      </div>
      <div class="footer">
        MERIDAS Operational Intelligence &middot; <a href="https://meridas.ai/privacy">Privacy Policy</a> &middot; <a href="https://meridas.ai/terms">Terms of Service</a>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};
