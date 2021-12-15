# Remix Firebase Auth Provider Example

This is an example repository showing how to implement Authentication with Firebase's Auth Providers ( Github, Facebook, Google, etc..).

It was heavily influenced by [Ryan Florence's Gist](https://gist.github.com/ryanflorence/f6a9c7852793fc7d6e21fbc80c6a2666) of the same, except this example is using Firebase v9.

## Requirements

Make sure you populate the `.env` file with your Firebase credentials.
You will also need to add your Firebase credentials to the `app/utils/firebase/firebase.client.ts` file when initializing the app.

## Demo

Going to the `/dashboard` route will automatically redirect you to `/auth/login` if you are not logged in.
Going to the `/auth/login` route while you are logged in will redirect you to `/dashboard`.

![Auth Examople](./auth-provider-example.gif)


## Contributing

Pull Requests are welcome if there are any improvements that can be made!