#!/bin/sh
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
sh bin/kafka-server-start.sh config/server.properties

