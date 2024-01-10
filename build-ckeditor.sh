echo "===================== step 1: build ckeditor"
cd ckeditor5
yarn build

echo "===================== step 2: add to node_module"
cd ..
yarn add file:./ckeditor5
