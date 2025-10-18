// Cloudflare Worker Code for Telegram Integration
// Copy this code to your Cloudflare Worker

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const data = await request.json()
    
    // Your Telegram Bot Token and Chat ID
    const BOT_TOKEN = '8223700392:AAEEL43W3FERteEe7W3vPAuYMIrmEbaSx_o' // Replace with your bot token
    const CHAT_ID = '7609652489' // Replace with your chat ID
    
    let message = ''
    
    // Only send orders to Telegram, ignore other types
    if (data.type === 'order' || data.type === 'food_order') {
      message = data.message
    } else {
      // For other types (visit, action), just return success without sending to Telegram
      return new Response(JSON.stringify({
        success: true,
        message: 'Action logged locally (not sent to Telegram)'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }
    
    // Send message to Telegram
    const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    })
    
    if (!telegramResponse.ok) {
      throw new Error(`Telegram API error: ${telegramResponse.status}`)
    }
    
    const telegramData = await telegramResponse.json()
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Message sent successfully',
      telegram_response: telegramData
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
    
  } catch (error) {
    console.error('Error:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
}

// Instructions for setup:
/*
1. Go to https://workers.cloudflare.com/
2. Create a new Worker
3. Replace the default code with this code
4. Replace YOUR_BOT_TOKEN_HERE with your actual bot token
5. Replace YOUR_CHAT_ID_HERE with your actual chat ID
6. Deploy the worker
7. Update the WORKER_URL in your script.js file with your worker URL

To get your bot token:
1. Message @BotFather on Telegram
2. Send /newbot
3. Follow the instructions to create a bot
4. Copy the token you receive

To get your chat ID:
1. Message your bot
2. Go to https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
3. Look for "chat":{"id": YOUR_CHAT_ID}
4. Copy the chat ID number
*/
