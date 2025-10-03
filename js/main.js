let rootUrl = "https://api.coingecko.com/api/v3/";
let apiKey = "CG-pH6GubCjEEDxAu9k5GoBdxig";
let pageNum = 1;
rowCount = 1;

function fetchTrendingData() {
let fetchTrendPromise = fetch(`${rootUrl}search/trending?x_cg_demo_api_key=${apiKey}`);

fetchTrendPromise
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json(); // return the promise
  })
  .then((data) => {
    let trendCoins = data.coins;

    for (let i = 0; i < Math.min(4, trendCoins.length); i++) {
      let trendCoinImage = trendCoins[i].item.small;
      let trendCoinName = trendCoins[i].item.name;
      let trendCoinPrice = trendCoins[i].item.data.price.toFixed(2);
      let price_change_24h = trendCoins[i].item.data.price_change_percentage_24h.usd.toFixed(2);

      // Create DOM elements
      let img = document.createElement("img");
      img.src = trendCoinImage;
      img.style.width = "28px";
      img.style.borderRadius = "50%";

      let trendingSection = document.querySelector(".trending-section");

      let trendCoin = document.createElement("div");
      trendCoin.style.display = "flex";
      trendCoin.style.alignItems = "center";
      trendCoin.style.gap = "10px";

      let pnlInfo = document.createElement("div");
      let trendCoinInfo = document.createElement("div");
      trendCoinInfo.style.display = "flex";
      trendCoinInfo.style.alignItems = "center";
      trendCoinInfo.style.justifyContent = "space-between";
      trendCoinInfo.style.fontSize = "15px";

      trendingSection.append(trendCoinInfo);
      trendCoinInfo.appendChild(trendCoin);
      trendCoinInfo.appendChild(pnlInfo);
      trendCoin.appendChild(img);

      let para = document.createElement("p");
      para.textContent = trendCoinName;
      para.style.color = "#FFFFFF";
      trendCoin.appendChild(para);

      let span1 = document.createElement("span");
      span1.textContent = `$${trendCoinPrice}`;
      span1.style.color = "#FFFFFF";
      pnlInfo.appendChild(span1);

      let span2 = document.createElement("span");
      if (price_change_24h < 0) {
        span2.innerHTML = `<span style="vertical-align: middle;">&#9660;</span>${Math.abs(price_change_24h)}%`;
        span2.style.color = "red";
      } else {
        span2.innerHTML = `&#9650;${price_change_24h}%`;
        span2.style.color = "green";
      }
      pnlInfo.appendChild(span2);
    }
  })
  .catch((error) => {
    console.error("Error fetching trending coins:", error);
    let trendingSection = document.querySelector(".trending-section");
    trendingSection.textContent = "⚠️ Failed to load trending coins.";
    trendingSection.style.color = "red";
  });
}

function fetchTopMcapData() {
  fetch(`${rootUrl}coins/markets?vs_currency=usd&order=market_cap_desc&per_page=4&page=1&x_cg_demo_api_key=${apiKey}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      let topMcapSection = document.querySelector(".topmcap-section");
      for (let i = 0; i < Math.min(4, data.length); i++) {
        let topCoinImage = data[i].image.replace("large", "small");
        let coinName = data[i].name;
        let coinPrice = data[i].current_price.toLocaleString();
        let percentagePriceChange = data[i].price_change_percentage_24h.toFixed(2);

        // Create DOM elements
        let img = document.createElement("img");
        img.src = topCoinImage;
        img.style.width = "28px";
        img.style.borderRadius = "50%";

        let cryptoInfo = document.createElement("div");
        cryptoInfo.style.display = "flex";
        cryptoInfo.style.alignItems = "center";
        cryptoInfo.style.justifyContent = "space-between";

        let cryptoName = document.createElement("div");
        cryptoName.style.display = "flex";
        cryptoName.style.alignItems = "center";
        cryptoName.style.gap = "10px";

        let pnlInfo = document.createElement("div");

        cryptoInfo.appendChild(cryptoName);
        cryptoInfo.appendChild(pnlInfo);
        cryptoName.appendChild(img);

        let topCoinName = document.createElement("p");
        topCoinName.textContent = coinName;
        topCoinName.style.color = "#FFFFFF";
        cryptoName.appendChild(topCoinName);

        let span1 = document.createElement("span");
        span1.textContent = `$${coinPrice}`;
        span1.style.color = "#FFFFFF";
        pnlInfo.appendChild(span1);

        let span2 = document.createElement("span");
        if (percentagePriceChange < 0) {
          span2.innerHTML = `<span style="vertical-align: middle;">&#9660;</span>${Math.abs(percentagePriceChange)}%`;
          span2.style.color = "red";
        } else {
          span2.innerHTML = `&#9650;${percentagePriceChange}%`;
          span2.style.color = "green";
        }
        pnlInfo.appendChild(span2);

        topMcapSection.appendChild(cryptoInfo);
      }
    })
    .catch((error) => {
      console.error("Error fetching top market cap coins:", error);
      let topMcapSection = document.querySelector(".topmcap-section");
      topMcapSection.textContent = "⚠️ Failed to load top market cap coins.";
      topMcapSection.style.color = "red";
    });
}

function fetchCoinsData() {
  fetch(`${rootUrl}coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=${pageNum}&x_cg_demo_api_key=${apiKey}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);

      let tableBody = document.querySelector(".table-body");
      tableBody.innerHTML = ""; // Clear old rows
      let fragment = document.createDocumentFragment(); // batch append for speed
       // reset numbering

      for (let i = 0; i < data.length; i++) {
        let coin = data[i];

        let imgUrl = coin.image.replace("large", "small");
        let coinName = coin.name;
        let coinTicker = coin.symbol.toUpperCase();
        let coinPrice = coin.current_price.toLocaleString();
        let priceChange24h = coin.price_change_percentage_24h;

        if (priceChange24h != null) {
          priceChange24h = priceChange24h.toFixed(2);
        } else {
          priceChange24h = 0.00;
        }

        let totalVolume = coin.total_volume.toLocaleString();
        let marketCap = coin.market_cap.toLocaleString();

        // --- Build Row ---
        let row = document.createElement("tr");
        row.style.borderBottom = "0.8px solid #696969";
        // Number
        let rowNumber = document.createElement("td");
        rowNumber.textContent = rowCount++;
        row.appendChild(rowNumber);

        // Coin Image + Name
        let coinImage = document.createElement("td");
        coinImage.style.display = "flex";
        coinImage.style.alignItems = "center";
        coinImage.style.gap = "10px";

        let img = document.createElement("img");
        img.src = imgUrl;
        img.style.width = "28px";
        img.style.borderRadius = "50%";

        coinImage.appendChild(img);

        let coinId = document.createElement("div");
        let cryptoName = document.createElement("div");
        cryptoName.textContent = coinName;
        let cryptoSymbol = document.createElement("div");
        cryptoSymbol.textContent = coinTicker;

        coinId.appendChild(cryptoName);
        coinId.appendChild(cryptoSymbol);
        coinImage.appendChild(coinId);
        row.appendChild(coinImage);

        // Price
        let tokenPrice = document.createElement("td");
        tokenPrice.textContent = `$${coinPrice}`;
        row.appendChild(tokenPrice);

        // % Change
        let percentPriceChange = document.createElement("td");
        let priceChange = document.createElement("span");

        if (priceChange24h < 0) {
          priceChange.innerHTML = `<span style="vertical-align: middle;">&#9660;</span>${Math.abs(priceChange24h)}%`;
          priceChange.style.color = "red";
        } else {
          priceChange.innerHTML = `&#9650;${priceChange24h}%`;
          priceChange.style.color = "green";
        }

        percentPriceChange.appendChild(priceChange);
        row.appendChild(percentPriceChange);

        // Volume
        let coinVolume = document.createElement("td");
        coinVolume.textContent = `$${totalVolume}`;
        row.appendChild(coinVolume);

        // Market Cap
        let marketCapital = document.createElement("td");
        marketCapital.textContent = `$${marketCap}`;
        row.appendChild(marketCapital);

        fragment.appendChild(row);
      }

      tableBody.appendChild(fragment); // append all at once
    })
    .catch((error) => {
      console.error("Error fetching coin data:", error);
      let tableBody = document.querySelector(".table-body");
      tableBody.innerHTML = `<tr><td colspan="6" style="color:red; text-align:center;">⚠️ Failed to load coin data</td></tr>`;
    });
}

//function to fetch crypto data
function fetchCryptoData(searchTerm) {
  console.log(searchTerm);
  let id = searchTerm.toLowerCase();
  id = id.trim();
  id = id.replaceAll(" ", "-");
  console.log(searchTerm)
  let cryptoDataPromise = fetch(`${rootUrl}coins/${id}?x_cg_demo_api_key=${apiKey}`);
  cryptoDataPromise.then((response) => {
    let jsonPromise = response.json()
    jsonPromise.then((data) => {
      console.log(data);
      let imgUrl = data.image.small;
      let coinName = data.name;
      let coinPrice = data.market_data.current_price.usd;
      coinPrice = `$${coinPrice.toLocaleString()}`;
      priceChange24h = data.market_data.price_change_percentage_24h;
      priceChange24h = priceChange24h.toFixed(2);
     let marketCap = data.market_data.market_cap.usd.toLocaleString();
     console.log(marketCap);
     let img = document.createElement("img");
     img.src = imgUrl;
     img.style.width = "40px";
     img.style.borderRadius = "50%";
     let searchResult = document.querySelector(".search-result");
     searchResult.style.display = "flex";
     searchResult.style.flexDirection ="column";
     searchResult.style.gap = "15px";
     let coinId = document.createElement("div");
     let tokenPrice = document.createElement("div");
     let percentChangeInfo = document.createElement("div");
     let marketCapital = document.createElement("div");
     percentChangeInfo.style.display = "flex";
     percentChangeInfo.style.alignItems = "center";
     searchResult.appendChild(coinId);
     searchResult.appendChild(tokenPrice);
     searchResult.appendChild(percentChangeInfo);
     searchResult.appendChild(marketCapital);
     coinId.style.display = "flex";
     coinId.style.alignItems = "center";
     coinId.style.gap = "13px"
     coinId.style.borderBottom = "0.8px solid #696969";
     coinId.style.paddingBottom = "10px"
     coinId.appendChild(img);
     let cryptoName = document.createElement("p");
     cryptoName.textContent = coinName;
     cryptoName.style.color = "#FFFFFF";
     cryptoName.style.fontSize = "20px";
     cryptoName.style.fontWeight = "500";
     coinId.appendChild(cryptoName);
     let cryptoPrice = document.createElement("p");
     cryptoPrice.textContent = coinPrice;
     cryptoPrice.style.color = "#FFFFFF";
     cryptoPrice.style.fontSize = "20px";
     cryptoPrice.style.fontWeight = "500";
     tokenPrice.appendChild(cryptoPrice);
     let priceChangeText = document.createElement("p");
     priceChangeText.textContent = "24h percentage price change";
     priceChangeText.style.color = "#FFFFFF";
     priceChangeText.style.fontSize = "15px";
     let priceChange = document.createElement("p");
    priceChange.style.fontSize = "15px";
    if (priceChange24h < 0) {
      priceChange.innerHTML = `<span style="vertical-align: middle;">&#9660;</span>${Math.abs(priceChange24h)}%`;
      priceChange.style.color = "red";
    }
    else {
      priceChange.innerHTML = `&#9650;${priceChange24h}%`;
      priceChange.style.color = "green";
    }
    percentChangeInfo.appendChild(priceChangeText);
    percentChangeInfo.appendChild(priceChange);
    let mcap = document.createElement("p");
    mcap.style.fontSize = "15px";
    mcap.style.color = "#FFFFFF";
    mcap.textContent = `Market Cap: $${marketCap}`;
    marketCapital.appendChild(mcap);
    
    });
  });
  
}
//End of the fetchCryptoData function 

function search() {
  let searchButton = document.querySelector(".search-button");
   searchButton.onclick = function() {
   console.log(window.innerWidth)
   let searchResult = document.querySelector(".search-result"); 
   // clear the search result
   searchResult.innerHTML = "";
   let searchBar =  document.querySelector(".search-bar");
   if (searchBar.value != "") {
   let searchTerm = searchBar.value;
   //clear the search bar
   searchBar.value = "";
   document.querySelector(".search-result-section").style.display = "block";
   fetchCryptoData(searchTerm);
   }
   }
}

//call the necessary functions 
search()
fetchTrendingData();
fetchTopMcapData();
fetchCoinsData();

// code to go to specific page
let enterButton = document.querySelector(".enter-button");
enterButton.onclick = function() {
  let pageInput = document.querySelector(".page-input");
 pageNum = Number(pageInput.value);
 let tableBody = document.querySelector(".table-body");
 tableBody.innerHTML = "";
 rowCount = ((pageNum * 100 - 100) + 1);
 fetchCoinsData();
}