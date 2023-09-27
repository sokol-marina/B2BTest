
const domain = 'example.com'; // Replace with your domain
const path = '/'; // Replace with your path


// Function to format and retrieve cookies
function getSubscriberFormattedCookies() {
    // Create an array to store the formatted cookies
    const formattedCookies = [];

    // Secure; regi, login, etc
    formattedCookies.push({
        name: 'NYT-S',
        value: '38XLWKIRQSWl7Ai4ubhRktmpwBjkehb9kxSXlQDoIr35x1Ua1GxCloqayUvtG/15rhHhOV9Ufq9.taQwK3e9kNS33bfvsR7xc.VQsu1NtIdBbFTsXDr0cGkenN3HTQxAV15ZouvqBfFmXe5X9C9/UG0YGZDEtGbfNnbAUJpbbHSNatjq9YgBAoKOqWIzr2vjQfViCgr0Y267coqye9SD.w0xSH4eYMt1QXthQX/G9fG6pLGEFi8XceyA5eT2.46g8L7.S1SSvLIXk0',
        domain: domain,
        path: path,
        secure: true, // Example: Set it to true if it's a secure cookie
    });
    // User Agent cookie
    formattedCookies.push({
      name: 'NYT_A_NAME',
      value: '0T4Lau8wpU6IHdxM4PSmx7',
      domain: domain,
      path: path,
  });

  return formattedCookies;
}


  module.exports = { getSubscriberFormattedCookies };