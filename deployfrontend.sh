rsync -r src/ docs/
rsync build/contracts/* docs/
git add .
git commit -m "Compiles files for Github Pages"
git push -u origin master