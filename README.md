# Authress Starter Kit: Vue

A repository that contains an Vue example that uses Authress to Login.

## Getting Started

Run `yarn` and then `yarn start`. Or use pnpm to install dependencies and then `start` the site.

### File Directory

* `src`
  * `main.ts` - Application Root and contains all the routes of the starter kit application
  * `authressClient.ts` - Configuration for Authress for users to login
  * `routes`
    * `home.ts` - Landing page which has login and logout buttons
    * `protected.ts` - Page protected by user login via the login guard defined in the `main.ts` file


## Demo Instructions

* `yarn`
* `yarn start`

There is a demo experience that has a UI and an service API. The UI makes API calls to the service. We can see the data rendered in the view.


# WALKTHROUGH

SET DEMO AS AUTHRESS ACCOUNT:
1. https://authress.io/app/#/settings
2. Delete comments in report controller
3. Delete Server.ts middleware


### Starting
* All data is public, users can log in and see their icon displayed.
* The API is running and the UI can make these calls, but they are unauthenticated.

### Add Login verification
* Add a middleware to get the token and verify it

```js server.ts
app.use(authress);
```

* Demo that the UI doesn't work anymore because the user isn't logged in.
* Add a guard in the UI that requires the user to log in.

```js router.ts
await ensureUserIsLoggedIn(next);
```

* Then they log in

### Add authorization
* Navigate to a specific resource
* We'll add a check to the service code which ensures that a user has the right permission to the resource

```js reportsController.ts
const result = await authress.hasAccessToResource(userId, '/reports', 'reports:get');
  if (!result) {
    return forbidden(response);
  }
```

* Then we'll see that they don't
* Then go to Authress and configure:
  * A new role
  * Add the role to the access record for the global reports

* What if they should only have access to some reports:

```js reportsController.ts
const result = await authress.getUserResources(userId, '/reports', 'reports:get');
allowedReports = result;
```
* Go back to the UI to display the list which now only has one element