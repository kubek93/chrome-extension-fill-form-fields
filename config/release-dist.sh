#!/bin/bash
npm run build
mkdir -p dist
zip -r dist/dist.zip public/*
