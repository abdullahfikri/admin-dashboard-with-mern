import Product from '../models/Product.js';
import ProductStat from '../models/ProductStat.js';
import User from '../models/user.js';
import Transaction from '../models/Transaction.js';
import getCountryIso3 from 'country-iso-2-to-3';

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();

        const productsWithStats = await Promise.all(
            products.map(async (product) => {
                const stat = await ProductStat.find({ productId: product._id });
                return {
                    ...product._doc,
                    stat,
                };
            })
        );

        res.status(200).json(productsWithStats);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getCostumers = async (req, res) => {
    try {
        const costumers = await User.find({ role: 'user' }).select('-password');
        res.status(200).json(costumers);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getTransactions = async (req, res) => {
    try {
        // sort should look like this: { "field": "userId", "sort": "desc"}
        const { page = 1, pageSize = 20, sort = null, search = `` } = req.query;

        // formatted sort should look like { userId: -1 }
        const generateSort = () => {
            const sortParsed = JSON.parse(sort);
            const sortFormatted = {
                [sortParsed.field]: sortParsed.sort === 'asc' ? 1 : -1,
            };

            return sortFormatted;
        };
        const sortFormatted = Boolean(sort) ? generateSort() : {};

        const transactions = await Transaction.find({
            $or: [
                { cost: { $regex: new RegExp(search, 'i') } },
                { userId: { $regex: new RegExp(search, 'i') } },
            ],
        })
            .sort(sortFormatted)
            .skip(page * pageSize)
            .limit(pageSize);
        // console.log(search === '');
        const total = await Transaction.countDocuments({
            $or: [
                { cost: { $regex: new RegExp(search, 'i') } },
                { userId: { $regex: new RegExp(search, 'i') } },
            ],
        });

        res.status(200).json({
            transactions,
            total,
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getGeography = async (req, res) => {
    try {
        const users = await User.find();

        const mappedLocations = users.reduce((acc, { country }) => {
            const countryISO3 = getCountryIso3(country);
            // ID -> IDN
            // {IDN }
            // { IDN: 0}
            // { IDN: 1}
            // CN -> CHN
            // {IDN:1}
            // {IDN:1, CHN:0}
            // {IDN:1, CHN:1}
            if (!acc[countryISO3]) {
                acc[countryISO3] = 0;
            }
            acc[countryISO3]++;
            return acc;
        }, {});

        const formattedLocations = Object.entries(mappedLocations).map(
            ([country, count]) => {
                return { id: country, value: count };
            }
        );

        return res.status(200).json(formattedLocations);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
