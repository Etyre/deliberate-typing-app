if [ -e ./secrets/jwtRS256.key ]; then
  echo "Private key already exists"
  exit 0
fi
ssh-keygen -t rsa -b 4096 -m PEM -f ./secrets/jwtRS256.key -q -N ""
# Don't add passphrase
openssl rsa -in ./secrets/jwtRS256.key -pubout -outform PEM -out ./secrets/jwtRS256.key.pub