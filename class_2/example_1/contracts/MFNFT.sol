// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MFNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
    {}

    // function strConcat(string memory _a, string memory _b) internal returns (string memory) {
    //     bytes memory _ba = bytes(_a);
    //     bytes memory _bb = bytes(_b);
    //     string memory ab = new string(_ba.length + _bb.length);
    //     bytes memory bab = bytes(ab);
    //     uint256 k = 0;
    //     for (uint256 i = 0; i < _ba.length; i++) bab[k++] = _ba[i];
    //     for (uint256 i = 0; i < _bb.length; i++) bab[k++] = _bb[i];
    //     return string(bab);
    // }

    function _baseURI() internal pure override returns (string memory) {
        return "https://metafighter.io/nft/";
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function safeMintMFT(address to) public payable {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        //safeMint(to, strConcat(_baseURI(), Strings.toString(tokenId)));
        safeMint(
            to,
            string(
                abi.encodePacked(_baseURI(), Strings.toString(tokenId), ".json")
            )
        );
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
