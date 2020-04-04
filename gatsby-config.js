require("dotenv").config();

module.exports = {
  plugins: [
    {
      resolve: "gatsby-source-twitter-profiles",
      options: {
        consumerKey: "0Qkk58Mxa10oIBuzN8pICam6Q",
        consumerSecret: process.env.WWD_TWITTER_CONSUMER_KEY,
        bearerToken: "AAAAAAAAAAAAAAAAAAAAABqoDQEAAAAAihq%2BYsaOSVBXEQ58UJ9syYkirbM%3DtnhvyBo762CdJcMYDwjurTUY9Xu7NDZn77GZ5xE6L9XfWM978S",
        twitterIdForFollowingList: "734750340"
      }
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        cssLoaderOptions: {
          camelCase: false
        }
      }
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: UA-43818380-2
      }
    },
    {
      resolve: `gatsby-plugin-favicon`,
      options: {
        logo: "./src/favicon.png",
        injectHTML: true,
        icons: {
          android: false,
          appleIcon: false,
          appleStartup: false,
          coast: false,
          favicons: true,
          firefox: false,
          twitter: false,
          yandex: false,
          windows: false
        }
      }
    }
  ]
};
