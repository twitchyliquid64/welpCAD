#!/bin/bash
/usr/local/go/bin/go run serv.go --addr :6521

PID=$!
wait $PID
trap - TERM INT
wait $PID
EXIT_STATUS=$?
