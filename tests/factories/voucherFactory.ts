import { faker } from "@faker-js/faker";

async function __createVoucher(){
    const voucher  = {
        id: faker.datatype.number({min:1}),
        code: faker.random.alphaNumeric(16),
        discount : faker.datatype.number({min: 1, max:100}),
        used : false
    }
    return voucher
};

function __calculateDiscount(value: number, discountValue: number){
    return value - (value * discountValue)
};

export default {
    __createVoucher,
    __calculateDiscount
}