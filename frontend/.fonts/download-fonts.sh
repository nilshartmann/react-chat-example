#! /bin/bash

http --download "https://fonts.googleapis.com/css?family=Lora:400,400i,700,700i|Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i" -o fonts.css

FONTS_DIR=../public/fonts/

for i in `cat fonts.css | grep url | cut -d "(" -f 4 | cut -d ")" -f 1`; do

    echo Font: $i

  # Host abschneiden (https://fonts.gstatic.com/)
  TARGET=`echo $i|cut -b27-`

  TARGET_FILE=$FONTS_DIR$TARGET

  TARGET_DIR=`dirname $TARGET_FILE`

  echo TARGET_FILE: $TARGET_FILE
  echo TARGET_DIR: $TARGET_DIR

  mkdir -p $TARGET_DIR

  curl $i -o $TARGET_FILE
done

sed 's/https:\/\/fonts.gstatic.com/\/fonts/' fonts.css >$FONTS_DIR/google-fonts.css
