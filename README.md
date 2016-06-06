# github-wiki-slack-notifier

Bluemix app that sends updates for a GitHub wiki to a Slack channel.

## Creating the App

1. If you do not already have a Bluemix account, [sign up here][bluemix_signup_url]

2. Download and install the [Cloud Foundry CLI][cloud_foundry_url] tool

3. Clone the app to your local environment

4. `cd` into this newly created directory

5. Open the `manifest.yml` file and change the `host` value to something unique

  The host you choose will determinate the subdomain of your application's URL:  `<host>.mybluemix.net`

6. Connect to Bluemix in the command line tool and follow the prompts to log in

  ```
  $ cf api https://api.ng.bluemix.net
  $ cf login
  ```

7. Push the app to Bluemix, but don't start it just yet

  ```
  $ cf push --no-start
  ```

## Create a GitHub Webhook

1. Create a random string to use as the webhook secret
  
  ```
  $ ruby -rsecurerandom -e 'puts SecureRandom.hex(20)'
  ```

2. Take the output of this command and go to `https://github.com/<your>/<repo>/settings/hooks/new` and create a new webhook
  
  - Payload URL: `https://<host>.mybluemix.net/webhook` (note trailing `/webhook` path)
  - Content type: `application/json`
  - Secret: `<webhook_secret>` (generated above)
  - Which events?
      - "Let me select individual events"
      - check only "Gollum"
  - Active: Checked

3. Tell the app about that secret by updating the respective value in `manifest.yml` and `.env`

## Create a Slack Webhook

1.  Go to `https://<your-group>.slack.com/services`

2. Select `Custom Integrations`, click on `Incoming Webooks`, and select `Add Configuration`

3. Give your webhook a name and an associated image

4. Get the webhook URL and associate it with your app by updating the respective value in `manifest.yml` and `.env`

## Do it live

Redeploy the app with `cf push` and voila! You will now be receiving GitHub wiki updates in your Slack channel.

## Credit

Thanks to [statico](https://github.com/statico) for the initial [Heroku app](https://github.com/artillery/github-wiki-slack-notifier) which inspired this Bluemix version.

<!--Links-->
[bluemix_signup_url]: https://new-console.ng.bluemix.net/registration/
[cloud_foundry_url]: https://github.com/cloudfoundry/cli

