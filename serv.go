package main

import (
  "log"
  "net/http"
  "flag"
)

var listenAddr string

func main() {
  flag.StringVar(&listenAddr, "addr", ":3000", "Listener spec")
  flag.Parse()
  fs := http.FileServer(http.Dir("static"))
  http.Handle("/", fs)

  log.Println("Listening on " + listenAddr + " ...")
  http.ListenAndServe(listenAddr, nil)
}
