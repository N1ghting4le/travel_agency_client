import { string, number, object } from "yup";

const schema = object().shape({
    roomType: string().required("Вы не выбрали тип номера"),
    nutrType: string().required("Вы не выбрали тип питания"),
    adultsAmount: number()
                    .typeError("Вы не ввели кол-во взрослых")
                    .integer("Кол-во взрослых должно быть целым числом")
                    .positive("Кол-во взрослых должно быть положительным"),
    childrenAmount: number()
                        .typeError("Вы не ввели кол-во детей")
                        .integer("Кол-во детей должно быть целым числом")
                        .min(0, "Кол-во детей должно быть неотрицательным")
});

export default schema;