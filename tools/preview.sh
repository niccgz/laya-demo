set -e

basepath=$(
    cd $(dirname $0)
    pwd
)
cd $basepath
cd ..

dir=$(pwd)
index="$dir/bin/index.html"
echo $index

open -na Google\ Chrome --args --user-data-dir=/tmp/temporary-chrome-profile-dir --disable-web-security --disable-site-isolation-trials $index
