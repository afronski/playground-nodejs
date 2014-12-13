module Main where

import Node.Express.Types
import Node.Express.App
import Node.Express.Handler

handler :: Handler
handler = sendJson { greeting: "Hello, World!" }

app :: App
app = get "/" handler

main = listen app 8080 \_ -> return unit