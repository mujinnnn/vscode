$(() => {

    // localStorage 초기화
    initLocalStorage();

    // 매장목록 출력
    printShopList();  
    
    // 재고목록 출력
    printStockList();

    // 이벤트핸들러 등록
    $('#shwriteBtn').on('click', () => {
        writeShop();
    });

    $('#stwriteBtn').on('click', () => {
        writeStock();
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
    shopArr.unshift(new Shop(getNextShopSeq(), $('#shname').val(), 0));
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
    return JSON.parse(localStorage.getItem('shopList'))
            .sort((a, b) => b.shno - a.shno);
};

// 매장목록 출력
const printShopList = () => {
    $('#shoplist table tbody').html('');
    getShopList().forEach(shop => {
        let tr = $("<tr></tr>");
        tr.append($("<td>"+shop.shno+"</td>"));
        tr.append($("<td><input id='shname"+shop.shno+"' class='width40px' type='text' value='"+shop.shname+"' /></td>"));
        tr.append($("<td>"+shop.shtotst+"</td>"));
        tr.append($("<td><input id='updateShopBtn"+shop.shno+"' type='button' value='수정' /></td>"));
        tr.append($("<td><input id='deleteShopBtn"+shop.shno+"' type='button' value='삭제' /></td>"));
        $('#shoplist table tbody').append(tr);
        $('#updateShopBtn' + shop.shno).on('click', () => {
            updateShop(shop.shno);
        });        
        $('#deleteShopBtn' + shop.shno).on('click', () => {
            deleteShop(shop.shno);
        });
    });
};

// 매장수정
const updateShop = shno => {
    const newShopList = getShopList().map(shop => {
        if (shop.shno == shno) {
            return new Shop(shop.shno, $('#shname' + shop.shno).val(), shop.shtotst);
        } else {
            return shop;
        }
    });
    localStorage.setItem('shopList', JSON.stringify(newShopList));
    printShopList();
};

// 매장삭제
const deleteShop = shno => {
    const newShopList = getShopList().filter(shop => {
        return shop.shno != shno;
    });
    localStorage.setItem('shopList', JSON.stringify(newShopList));
    printShopList();
};

/*ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ*/

// 재고등록
const writeStock = () => {
    const stockArr = getStockList();
    stockArr.push(new Stock(getNextStockSeq(), $('#stname').val(), $('#stamt').val(), $('#stindate').val(), 0));
    localStorage.setItem('stockList', JSON.stringify(stockArr));
    printStockList();
};

// 재고번호 시퀀스
const getNextStockSeq = () => {
    const nextStockSeq = Number(localStorage.getItem('stockSeq')) + 1;
    localStorage.setItem('stockSeq', nextStockSeq);
    return Number(nextStockSeq);
};

// 재고목록
const getStockList = () => {
    return JSON.parse(localStorage.getItem('stockList'))
            .sort((a,b) => b.stno - a.stno);
};

// 재고목록 출력
const printStockList = () => {
    $('#stocklist table tbody').html('');
    
    const stockList = getStockList(); 
    
    if(stockList) {
        stockList.forEach(stock => {
            let tr = $('<tr></tr>');
            tr.append($('<td>' + stock.stno + '</td>'));
            tr.append($('<td>' + stock.stname + '</td>'));
            tr.append($('<td>' + stock.stamt + '</td>'));
            tr.append($('<td>' + stock.stindate + '</td>'));
            tr.append($('<td>' + stock.strgdate + '</td>')); 
            tr.append($('<td><input type="button" value="수정" /></td>'));
            tr.append($('<td><input id="deleteStock' + stock.stno + '" type="button" value="삭제" /></td>'));
            $('#stocklist table tbody').append(tr);
         
            $('#' + 'deleteStock' + stock.stno).on('click', () => {
                deleteStock(stock.stno);
            });          
        });
    }
};

// 재고수정

const updateStock = shno => {
    const newStockList = getStockList().map(stock => {
        if (stock.stno == stno) {
            return new Stock(stock.stno, $('#stname' + stock.stno).val(), stock.stamt);
        } else {
            return stock;
        }
    });
    localStorage.setItem('stockList', JSON.stringify(newStockList));
    printStockList();
};

// 재고삭제
const deleteStock = stno => {
    const newStockList = getStockList().filter(stock => {
        return stock.stno != stno;
    });
    localStorage.setItem('stockList', JSON.stringify(newStockList));
    printStockList();
};

// 재고수량변경