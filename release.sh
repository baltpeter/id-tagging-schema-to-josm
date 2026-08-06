#!/bin/zsh
test -z "$(git status --porcelain)"
git_is_clean_status=$?

if [[ $git_is_clean_status != 0 ]]; then
    echo "The repo is not clean!"
    exit 1
fi

git merge-base --is-ancestor HEAD @{u}
git_has_been_pushed_status=$?

if [[ $git_has_been_pushed_status != 0 ]]; then
    echo "The latest changes have not been pushed yet!"
    exit 1
fi

version=$(jq -r '.version' package.json)

if ! read -q "choice?Do you want to release $version?"; then
    exit 1
fi
echo

gh release view $version > /dev/null 2>&1
release_check_status=$?

if [[ $release_check_status != 1 ]]; then
    echo "Release already exists!"
    exit 1
fi

echo "Building …"
rm -rf out icons
yarn compile-icons
yarn build

echo "Releasing…"
gh release create v$version --fail-on-no-commits --generate-notes ./out/*.xml ./out/*.zip
