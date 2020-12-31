const walletUrl = 'https://wallet.hypersign.com';

export default () =>
  browser.webRequest.onBeforeRequest.addListener(
    ({ url }) => ({
      redirectUrl: browser.runtime.getURL(`/popup/popup.html#${url.replace(walletUrl, '')}`),
    }),
    {
      urls: [`${walletUrl}/*`],
      types: ['main_frame'],
    },
    ['blocking'],
  );
