#!/bin/bash
go run serv.go

PID=$!
wait $PID
trap - TERM INT
wait $PID
EXIT_STATUS=$?
