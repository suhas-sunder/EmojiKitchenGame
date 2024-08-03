/* eslint-disable react/no-unescaped-entities */
import { Link, MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Cookies Policy 🍪" },
    { name: "description", content: "Emoji Kitchen Game Cookies policy!" },
  ];
};

export default function cookiespolicy() {
  return (
    <div className="my-20 flex flex-col items-center justify-center gap-8 font-nunito text-defaultblue">
      <header className="max-w-[1200px]">
        <h1 className="mb-5 flex py-2 text-4xl">COOKIE POLICY</h1>
        <h2 className="flex py-2 text-2xl">Last updated August 02, 2024</h2>
        <p className="flex flex-col gap-4 py-2">
          This Cookie Policy explains how http://emojikitchengame.com
          ('Company', 'we', 'us', and 'our') uses cookies and similar
          technologies to recognize you when you visit our website at
          https://emojikitchengame.com ('Website'). It explains what these
          technologies are and why we use them, as well as your rights to
          control our use of them.
        </p>
        <p>
          In some cases we may use cookies to collect personal information, or
          that becomes personal information if we combine it with other
          information.
        </p>
      </header>
      <main className="flex max-w-[1200px] flex-col gap-8">
        <section className="flex flex-col gap-4">
          <h2 className="flex py-2 text-2xl">What are cookies?</h2>
          <p>
            Cookies are small data files that are placed on your computer or
            mobile device when you visit a website. Cookies are widely used by
            website owners in order to make their websites work, or to work more
            efficiently, as well as to provide reporting information.
          </p>
          <p>
            Cookies set by the website owner (in this case,
            http://emojikitchengame.com) are called 'first-party cookies.'
            Cookies set by parties other than the website owner are called
            'third-party cookies.' Third-party cookies enable third-party
            features or functionality to be provided on or through the website
            (e.g., advertising, interactive content, and analytics). The parties
            that set these third-party cookies can recognize your computer both
            when it visits the website in question and also when it visits
            certain other websites.
          </p>
          <h3>Google Analytics cookies and identifiers</h3>
          <p>
            Google Analytics mainly uses first-party cookies to report on
            visitor (aka. user) interactions on Google Analytics customers’
            websites. Users may disable cookies or delete any individual cookie.
            In addition, Google Analytics supports an optional browser add-on
            that - once installed and enabled - disables measurement by Google
            Analytics for any site a user visits. Note that this add-on only
            disables Google Analytics measurement. Where a site or app uses
            Google Analytics for Apps or the Google Analytics for Firebase SDKs,
            Google Analytics collects an app-instance identifier — a randomly
            generated number that identifies a unique installation of an App.
            Whenever a user resets their Advertising Identifier (Advertising ID
            on Android, and ID for Advertisers on iOS), the app-instance
            identifier is also reset. Where sites or apps have implemented
            Google Analytics with other Google Advertising products, like Google
            Ads, additional advertising identifiers may be collected. Users can
            opt-out of this feature and manage their settings for this cookie
            using the
          </p>
          <Link to="https://support.google.com/analytics/answer/6004245?hl=en#zippy=%2Cdata-access%2Cour-privacy-policy%2Cgoogle-analytics-cookies-and-identifiers">
            Learn More...
          </Link>
          <Link to="https://policies.google.com/technologies/cookies?sjid=12136297673222101893-NC">
            Find out how Google uses cookies...
          </Link>
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="flex py-2 text-2xl">Why do we use cookies?</h2>
          <p>
            We use first- and third-party cookies for several reasons. Some
            cookies are required for technical reasons in order for our Website
            to operate, and we refer to these as 'essential' or 'strictly
            necessary' cookies. Other cookies also enable us to track and target
            the interests of our users to enhance the experience on our Online
            Properties. Third parties serve cookies through our Website for
            advertising, analytics, and other purposes. This is described in
            more detail below.
          </p>
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="flex py-2 text-2xl">How can I control cookies?</h2>
          <p>
            You have the right to decide whether to accept or reject cookies.
            You can exercise your cookie rights by setting your preferences in
            the Cookie Consent Manager. The Cookie Consent Manager allows you to
            select which categories of cookies you accept or reject. Essential
            cookies cannot be rejected as they are strictly necessary to provide
            you with services.
          </p>
          <p>
            The Cookie Consent Manager can be found in the notification banner
            and on our website. If you choose to reject cookies, you may still
            use our website though your access to some functionality and areas
            of our website may be restricted. You may also set or amend your web
            browser controls to accept or refuse cookies.
          </p>
          <p>
            The specific types of first- and third-party cookies served through
            our Website and the purposes they perform are described in the table
            below (please note that the specific cookies served may vary
            depending on the specific Online Properties you visit):
          </p>
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="flex py-2 text-2xl">
            Analytics and customization cookies:
          </h2>
          <p>
            These cookies collect information that is used either in aggregate
            form to help us understand how our Website is being used or how
            effective our marketing campaigns are, or to help us customize our
            Website for you.
          </p>
          <p>Name: _ga</p>
          <p>
            Purpose: Records a particular ID used to come up with data about
            website usage by the user
          </p>
          <p>Provider: emojikitchengame.com</p>
          <p>Service: Google Analytics View Service Privacy Policy</p>
          <p>Country: Canada</p>
          <p>Type: http_cookie</p>
          <p>Expires in: 1 year 1 month 4 days</p>
          <p>Name: _ga_#</p>
          <p>
            Purpose: Used to distinguish individual users by means of
            designation of a randomly generated number as client identifier,
            which allows calculation of visits and sessions
          </p>
          <p>Provider: emojikitchengame.com</p>
          <p>Service: Google Analytics View Service Privacy Policy</p>
          <p>Country: Canada</p>
          <p>Type: http_cookie</p>
          <p>Expires in: 1 year 1 month 4 days</p>
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="flex py-2 text-2xl">
            How can I control cookies on my browser?
          </h2>
          <p>
            As the means by which you can refuse cookies through your web
            browser controls vary from browser to browser, you should visit your
            browser's help menu for more information. The following is
            information about how to manage cookies on the most popular
            browsers:
          </p>
          <p>Chrome, Internet Explorer, Firefox, Safari, Edge, Opera</p>
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="flex py-2 text-2xl">
            What about other tracking technologies, like web beacons?
          </h2>
          <p>
            Cookies are not the only way to recognize or track visitors to a
            website. We may use other, similar technologies from time to time,
            like web beacons (sometimes called 'tracking pixels' or 'clear
            gifs'). These are tiny graphics files that contain a unique
            identifier that enables us to recognize when someone has visited our
            Website or opened an email including them. This allows us, for
            example, to monitor the traffic patterns of users from one page
            within a website to another, to deliver or communicate with cookies,
            to understand whether you have come to the website from an online
            advertisement displayed on a third-party website, to improve site
            performance, and to measure the success of email marketing
            campaigns. In many instances, these technologies are reliant on
            cookies to function properly, and so declining cookies will impair
            their functioning.
          </p>
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="flex py-2 text-2xl">
            Do you use Flash cookies or Local Shared Objects?
          </h2>
          <p>
            Websites may also use so-called 'Flash Cookies' (also known as Local
            Shared Objects or 'LSOs') to, among other things, collect and store
            information about your use of our services, fraud prevention, and
            for other site operations.
          </p>
          <p>
            If you do not want Flash Cookies stored on your computer, you can
            adjust the settings of your Flash player to block Flash Cookies
            storage using the tools contained in the Website Storage Settings
            Panel. You can also control Flash Cookies by going to the Global
            Storage Settings Panel and following the instructions (which may
            include instructions that explain, for example, how to delete
            existing Flash Cookies (referred to 'information' on the Macromedia
            site), how to prevent Flash LSOs from being placed on your computer
            without your being asked, and (for Flash Player 8 and later) how to
            block Flash Cookies that are not being delivered by the operator of
            the page you are on at the time).
          </p>
          <p>
            Please note that setting the Flash Player to restrict or limit
            acceptance of Flash Cookies may reduce or impede the functionality
            of some Flash applications, including, potentially, Flash
            applications used in connection with our services or online content.
          </p>
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="flex py-2 text-2xl">
            Do you serve targeted advertising?
          </h2>
          <p>
            Third parties may serve cookies on your computer or mobile device to
            serve advertising through our Website. These companies may use
            information about your visits to this and other websites in order to
            provide relevant advertisements about goods and services that you
            may be interested in. They may also employ technology that is used
            to measure the effectiveness of advertisements. They can accomplish
            this by using cookies or web beacons to collect information about
            your visits to this and other sites in order to provide relevant
            advertisements about goods and services of potential interest to
            you. The information collected through this process does not enable
            us or them to identify your name, contact details, or other details
            that directly identify you unless you choose to provide these.
          </p>
          <h3>Google advertising cookies</h3>
          <p>
            Google uses cookies to help serve the ads it displays on the
            websites of its partners, such as websites displaying Google ads or
            participating in Google certified ad networks. When users visit a
            Google partner's website, a cookie may be dropped on that end user's
            browser.
          </p>
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="flex py-2 text-2xl">
            How often will you update this Cookie Policy?
          </h2>
          <p>
            We may update this Cookie Policy from time to time in order to
            reflect, for example, changes to the cookies we use or for other
            operational, legal, or regulatory reasons. Please therefore revisit
            this Cookie Policy regularly to stay informed about our use of
            cookies and related technologies.
          </p>
          <p>
            The date at the top of this Cookie Policy indicates when it was last
            updated.
          </p>
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="flex py-2 text-2xl">
            Where can I get further information?
          </h2>
          <p>
            If you have any questions about our use of cookies or other
            technologies, please contact us at: admin@emojikitchengame.com.
          </p>
        </section>
      </main>
    </div>
  );
}
