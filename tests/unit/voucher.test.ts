import voucherRepository from "../../src/repositories/voucherRepository";
import voucherService from "../../src/services/voucherService";
import voucherFactory from "../factories/voucherFactory";


jest.mock("../../src/repositories/voucherRepository")

describe("Voucher creation", () => {
    it("Creation sucess - 201", async () => {
        const expectedVoucher = await voucherFactory.__createVoucher();

        jest
            .spyOn(voucherRepository, "getVoucherByCode")
            .mockResolvedValueOnce(null);
        jest
            .spyOn(voucherRepository, "createVoucher")
            .mockResolvedValueOnce(expectedVoucher);
        
        const { createVoucher } = voucherService;

        await expect(createVoucher(expectedVoucher["code"], expectedVoucher["discount"])).resolves.not.toThrow();
        expect(voucherRepository.createVoucher).toBeCalled();
    });

    it("Already have that voucher - 409", async () => {
        const expectedVoucher = await voucherFactory.__createVoucher();
        jest
            .spyOn(voucherRepository, "getVoucherByCode")
            .mockResolvedValueOnce(expectedVoucher)

        jest
            .spyOn(voucherRepository, "createVoucher")
            .mockResolvedValueOnce(null)

        const { createVoucher } = voucherService;
        expect(createVoucher(expectedVoucher["code"], expectedVoucher["discount"])).rejects.toEqual({type: "conflict", message:"Voucher already exist."});
    })
});

describe("Using Voucher", () => {
    it("Sucess on using voucher - 200", async () => {
        const expectedVoucher = await voucherFactory.__createVoucher();
        jest
            .spyOn(voucherRepository, "getVoucherByCode")
            .mockResolvedValueOnce(expectedVoucher);
        jest
            .spyOn(voucherRepository, "useVoucher")
            .mockResolvedValueOnce({...expectedVoucher, used:true})
        
        const { applyVoucher } = voucherService;
        const amount = 300;
        await expect(applyVoucher(expectedVoucher["code"], amount)).resolves.not.toThrow();
        expect(voucherRepository.useVoucher).toBeCalled();
    })

    it("Voucher dosen't exist - 409", async () => {
        const expectedVoucher = await voucherFactory.__createVoucher();
        jest
            .spyOn(voucherRepository, "getVoucherByCode")
            .mockResolvedValueOnce(null)
        const { applyVoucher } = voucherService;
        const amount = 300;
        await expect(applyVoucher(expectedVoucher["code"], amount)).rejects.toEqual({type:"conflict", message: "Voucher does not exist."})
    })
})