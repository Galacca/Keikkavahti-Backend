For a more detailed explanation for what this fullstack app is about check the frontends github at

https://github.com/Galacca/Keikkavahti-frontend

# What technologies did I use for the backend?

Node.js,
Express,
Zod,
JsonWebToken,
DotEnv,
MySQL,
AWS

# Why not use an ORM?

I thought about using one for a long time. Could not really find one that I liked and the project was fairly small scale, so I thought to myself "How bad can it actually be to write the SQL syntax by hand?"

Yeah it can be pretty bad.

# Is it deployed?

Yes. Using AWS Elastic Beanstalk.

# What were my design principles?

1. Sanitize all input, even when it would take a forged request to inject.
2. Whoever send the request is always determined by the webtoken, so you cannot for example forge a request so that person A can force persons B and C become friends with each other.
3. "Help" the frontend out when it's more feasible to do a certain task in backend, such as sorting things by date.

# Is it done?

Not a single endpoint to add. No bugs that im aware of.

However I am really not happy with how some of the code shaped out to be. I had not written a TypeScript backend ever before and it shows...
I tried different styles at first to see which one I like so there are some really bad inconsistancies in the code and some bad typings.




