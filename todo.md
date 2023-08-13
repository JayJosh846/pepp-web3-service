hings to do.

- [x] Blockchain Node Deployment/Connector
- [x] Tokenize e-receipts from AFEX
- [x] Admin authorization
- [x] Blockchain user Account Creation and Access Levels
- [x] Whitelist and Blacklist of Users
- [x] Marketplace (Buying and Selling, Transfer of tokenized e-receipt)
- [ ] Escrow account
- [x] Web3js Socket Connectors(Getters and Setters)
- [ ] Prevent user from transfering token approved for sale

Smart Contract Application Flow
##Tokenize receipt

- [x] Only Admin can register user's bio
- [x] Only Admin can add user's product
- [x] Admin can only create ereceipt for whitelisted users
- [ ] Get owner of a tokenized receipt via receipt addr
- [x] Compare the last blockchain event of tokenized e-receipt with the last array value of OwnerCommoditiesAddr
- [x] Ensures only user can transfer what he or she owns
- [ ] Reduce the quantity of commodity in the receipt upon loan request success
      After admin adds user's account, he proceeds to register the product associated with the bio-data with array key as asset id from array of saved data

##Escrow and Transfer Tokenized receipt

- [x] Create Escrow Account
- [ ] Move e-receipt to Escrow and Authorize/Approve account to move your e-receipt to a new owner
- [ ] Transfer ownership of e-receipt
- [ ] Change e-recipt record detail to the new owner
- [ ] Burn tokenize receipt after user withdraws commodity from AFEX
- [x] Mint: Record tokenized receipt to users - DONE

##Sterling Collaterized Debt Position

##Admin and User Management

- [x] Add Admin
- [x] Remove Admin
- [x] WhiteList and Blacklist of Users
