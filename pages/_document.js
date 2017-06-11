import Document, { Head, Main, NextScript } from 'next/document';
import flush from 'styled-jsx/server';

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const { html, head, errorHtml, chunks } = renderPage();
    const styles = flush();
    return { html, head, errorHtml, chunks, styles };
  }

  render() {
    return (
      <html>
        <Head>
          <title>YoutuberSpy</title>
          <link rel="icon" href="static/logo.png" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <style>{`
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              font-size: 100%;
              font-family: "jaf-facitweb","Helvetica Neue",Arial,sans-serif;
              text-decoration: none;
            }
          `}</style>
          <script src="https://apis.google.com/js/platform.js"></script>
        </Head>
        <body className="custom_class">
          {this.props.customValue}
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
