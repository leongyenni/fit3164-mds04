#!/bin/bash

# Kill each PID stored in the file
while read pid; do
  kill $pid
done < pids.txt

# Remove the file afterwards
rm pids.txt
