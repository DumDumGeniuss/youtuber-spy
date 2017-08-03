import Document, { Head, Main, NextScript } from 'next/document';
import flush from 'styled-jsx/server';

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const { html, head, errorHtml, chunks } = renderPage();
    const styles = flush();
    return { html, head, errorHtml, chunks, styles };
  }

  /* In this jsx, cotaining Google-Analytics, Google-Search-Console */
  render() {
    return (
      <html>
        <Head>
          <link rel="icon" href="/static/logo.png"/>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <meta name="google-site-verification" content="tmsEPlkD5D2xgD2TrX90qpIgqJc1Rmzl5v_2fXW-1GY" />
          <style>{`
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              font-size: 100%;
              font-family: "jaf-facitweb","Helvetica Neue",Arial,sans-serif;
              text-decoration: none;
            }

            @media only screen and (max-width: 600px) {
              font-size: 80%;
            }
          `}</style>
          <script dangerouslySetInnerHTML={{__html: `
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
          
            ga('create', 'UA-82279826-3', 'auto');
            ga('send', 'pageview');
          `}} />
          <link href="https://cdn.quilljs.com/1.3.0/quill.snow.css" rel="stylesheet"/>
          <script src={'//cdn.quilljs.com/1.3.0/quill.min.js'}></script>
        </Head>
        <body className="custom_class">
          <div dangerouslySetInnerHTML={{__html: `
            <div id="fb-root"></div>
            <script>
              var IS_FB_API_LOADED = false;
              window.fbAsyncInit = function() {
                FB.init({
                  appId      : '158925374651334',
                  cookie     : true,  // enable cookies to allow the server to access
                                      // the session
                  xfbml      : true,  // parse social plugins on this page
                  version    : 'v2.9' // use graph api version 2.8
                });
                IS_FB_API_LOADED = true;
                var event = new CustomEvent('fb-api-loaded', { 'detail': 'FB api loaded!!' });
                document.dispatchEvent(event);
              };
              (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.10&appId=158925374651334";
                fjs.parentNode.insertBefore(js, fjs);
              }(document, 'script', 'facebook-jssdk'));
            </script>
          `}}/>
          {this.props.customValue}
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
