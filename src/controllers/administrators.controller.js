"use strict";
import { Exceptions } from "../helpers/classError.js";
import { handlerHttpErrors } from "../helpers/errorhandler.js";
import administratorsService from "../services/administrators.service.js";






/**
 * @author Andres Galvis
 * @method GET
 * @path  /api/v1/administrators/
*/
const findAll = async (req, res) => {
    try {
        const response = await administratorsService.getAll(req.dto);
        return res.json({
            success: true,
            message: "Consultado correctamente.",
            data: response
        });
    } catch (error) {
        handlerHttpErrors(res, error);
    }
}





/**
 * @author Andres Galvis
 * @method GET
 * @path  /api/v1/administrators/:id
*/
const findById = async (req, res) => {
    try {
        const { id } = req.dto;
        const response = await administratorsService.getById(id);
        return res.json({
            success: true,
            message: "Consultado correctamente",
            data: response
        })
    } catch (error) {
        handlerHttpErrors(res, error);
    }
}








/**
 * @author Andres Galvis
 * @method POST
 * @path  /api/v1/administrators/
*/
const createNew = async (req, res) => {
    try {
        const body = req.dto;
        const response = await administratorsService.createNew(body);
        return res.status(201).json({
            success: true,
            message: 'Creado correctamente.',
            data: response
        });
    } catch (error) {
        handlerHttpErrors(res, error);
    }
}





/**
 * @author Andres Galvis
 * @method 
 * @path  
*/
const updateOne = async (req, res) => {
    try {
        const response = await administratorsService.update(req.dto);
        return res.json({
            success: true,
            message: 'Actualizado correctamente',
            data: response
        });
    } catch (error) {
        handlerHttpErrors(res, error);
    }
}






/**
 * @author Andres Galvis
 * @method 
 * @path  
*/
const deteleOne = async (req, res) => {
    try {
        const { id } = req.dto;
        const response = await administratorsService.deleteOne(id);
        return res.json({
            success: true,
            message: 'Eliminación exitosa',
            removed: response
        })
    } catch (error) {
        handlerHttpErrors(res, error);
    }
}



export default {
    findAll,
    findById,
    createNew,
    updateOne,
    deteleOne
}