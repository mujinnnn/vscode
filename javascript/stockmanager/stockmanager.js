$(() => {

    // localStorage 초기화
    initLocalStorage();

    // 매장목록 출력
    printShopList();    

    // 이벤트핸들러 등록
    $('#shwriteBtn').on('click', () => {
        writeShop();
    });

});

// localStorage 초기화
const initLocalStorage = () => {
    if (localStorage) {
        if (!localStorage.getItem('shopSeq')) {
            localStorage.setItem('shopSeq', '0');
        }
        if (!localStorage.getItem('stockSeq')) {
            localStorage.setItem('stockSeq', '0');
        }                
        if (!localStorage.getItem('shopList')) {
            localStorage.setItem('shopList', '[]');
        }
        if (!localStorage.getItem('stockList')) {
            localStorage.setItem('stockList', '[]');
        }        
    }
};

// 매장등록
const writeShop = () => {
    const shopArr = getShopList();
    shopArr.push(new Shop(getNextShopSeq(), $('#shname').val(), 0));
    localStorage.setItem('shopList', JSON.stringify(shopArr));
    printShopList();
};

// 매장번호 시퀀스
const getNextShopSeq = () => {
    const nextShopSeq = Number(localStorage.getItem('shopSeq')) + 1;
    localStorage.setItem('shopSeq', nextShopSeq);
    return Number(nextShopSeq);
};

// 매장목록
const getShopList = () => {
    return JSON.parse(localStorage.getItem('shopList'));
};

// 매장목록 출력
const printShopList = () => {
    $('#shoplist table tbody').html('');
    getShopList().forEach(shop => {
        let tr = $('<tr></tr>');
        tr.append($('<td>' + shop.shno + '</td>'));
        tr.append($('<td>' + shop.shname + '</td>'));
        tr.append($('<td>' + shop.shtotst + '</td>'));
        tr.append($('<td><input type="button" value="수정" /></td>'));
        tr.append($('<td><input id="deleteShop' + shop.shno + '" type="button" value="삭제" /></td>'));
        $('#shoplist table tbody').append(tr);
        $('#' + 'deleteShop' + shop.shno).on('click', () => {
            deleteShop(shop.shno);
        });          
    });
};

// 매장수정

// 매장삭제
const deleteShop = shno => {
    const newShopList = getShopList().filter(shop => {
        return shop.shno != shno;
    });
    localStorage.setItem('shopList', JSON.stringify(newShopList));
    printShopList();
};

// 재고목록
const getStockList = () => {
    return JSON.parse(localStorage.getItem('stockList'));
};

// 재고목록 출력
const printStockList = () => {
    $('#stocklist table tbody').html('');
    getStockList().forEach(stock => {
        let tr = $('<tr></tr>');
        tr.append($('<td>' + stock.stno + '</td>'));
        tr.append($('<td>' + stock.stname + '</td>'));
        tr.append($('<td>' + stock.stamt + '</td>'));
        tr.append($('<td>' + stock.stindate + '</td>'));
        tr.append($('<td>' + stock.strgdate + '</td>'));
        tr.append($('<td>' + stock.shno + '</td>'));
        tr.append($('<td><input type="button" value="수정" /></td>'));
        tr.append($('<td><input id="deleteStock' + stock.shno + '" type="button" value="삭제" /></td>'));
        $('#stocklist table tbody').append(tr);
        $('#' + 'deleteStock' + stock.shno).on('click', () => {
            deleteStock(stock.shno);
        });          
    });
};

// 재고등록
const writeStock = () => {
    const stockArr = getStockList();
    stockArr.push(new Stock(getNextStockSeq(), $('#shname').val(), 0));
    localStorage.setItem('stockList', JSON.stringify(stockArr));
    printStockList();
};

// 재고수정

// 재고삭제
const deleteStock = stno => {
    const newStockList = getStockList().filter(stock => {
        return stock.stno != stno;
    });
    localStorage.setItem('stockList', JSON.stringify(newStockList));
    printStockList();
};

// 재고수량변경