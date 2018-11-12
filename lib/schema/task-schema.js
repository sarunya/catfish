'use strict';

const joi = require('joi');

const userInfoPayload = joi.object({
    email: joi.string().description('The SKU for the product').required(),
    password: joi.string().description('The SKU for the product').required(),
    first_name: joi.string().description('The SKU for the product').required(),
    last_name: joi.string().description('The SKU for the product').required(),
    mobile_number: joi.string().description('The SKU for the product').optional()
})

const taskInfoPayload = joi.object({
    email: joi.string().description('The SKU for the product').required(),
    task_title: joi.string().description('The SKU for the product').required(),
    task_description: joi.string().description('The SKU for the product').required(),
    scheduled_date: joi.string().description('The SKU for the product').required(),
    categories: joi.array().description('The SKU for the product').default("Default"),
    status : joi.string().description('The SKU for the product').default("Not Started")
})

module.exports = {
    userInfoPayload,
    taskInfoPayload
}