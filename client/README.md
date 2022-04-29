## Setup local SSL

First add the following line to your `/etc/hosts` file:

```
127.0.0.1 l.expertoption.dev
```

Then run these commands:

```bash
# macOS
brew install mkcert

# Windows
choco install mkcert

# activate
mkcert -install

# cd into project root folder and
mkcert "l.expertoption.dev" 127.0.0.1
```
