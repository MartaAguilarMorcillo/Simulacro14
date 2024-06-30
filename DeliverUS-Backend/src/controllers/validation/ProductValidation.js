import { check } from 'express-validator'
import { Restaurant } from '../../models/models.js'
import { checkFileIsImage, checkFileMaxSize } from './FileValidationHelper.js'

const maxFileSize = 2000000 // around 2Mb

const checkRestaurantExists = async (value, { req }) => {
  try {
    const restaurant = await Restaurant.findByPk(req.body.restaurantId)
    if (restaurant === null) {
      return Promise.reject(new Error('The restaurantId does not exist.'))
    } else { return Promise.resolve() }
  } catch (err) {
    return Promise.reject(new Error(err))
  }
}

// SOLUCIÓN
const checkCalories = async (value, { req }) => {
  try {
    const calorias = (req.body.fats * 9) + (req.body.proteins * 4) + (req.body.carbohydrates * 4)
    if (calorias > 1000) {
      return Promise.reject(new Error('Producto no puede contener más de 1000 calorías por 100g de producto'))
    } else { return Promise.resolve() }
  } catch (err) {
    return Promise.reject(new Error(err))
  }
}

const create = [
  check('name').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('description').optional({ checkNull: true, checkFalsy: true }).isString().isLength({ min: 1 }).trim(),
  check('price').exists().isFloat({ min: 0 }).toFloat(),
  check('order').default(null).optional({ nullable: true }).isInt().toInt(),
  check('availability').optional().isBoolean().toBoolean(),
  check('productCategoryId').exists().isInt({ min: 1 }).toInt(),
  check('restaurantId').exists().isInt({ min: 1 }).toInt(),
  check('restaurantId').custom(checkRestaurantExists),
  check('image').custom((value, { req }) => {
    return checkFileIsImage(req, 'image')
  }).withMessage('Please upload an image with format (jpeg, png).'),
  check('image').custom((value, { req }) => {
    return checkFileMaxSize(req, 'image', maxFileSize)
  }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
  // SOLUCIÓN
  check('fats').optional().isFloat({ min: 0 }).toFloat(),
  check('proteins').optional().isFloat({ min: 0 }).toFloat(),
  check('carbohydrates').optional().isFloat({ min: 0 }).toFloat(),
  check('calories').optional().isFloat({ min: 0 }).toFloat(),
  check('calories').custom(checkCalories).withMessage('Producto no puede contener más de 1000 calorías por 100g de producto')
]

const update = [
  check('name').exists().isString().isLength({ min: 1, max: 255 }),
  check('description').optional({ nullable: true, checkFalsy: true }).isString().isLength({ min: 1 }).trim(),
  check('price').exists().isFloat({ min: 0 }).toFloat(),
  check('order').default(null).optional({ nullable: true }).isInt().toInt(),
  check('availability').optional().isBoolean().toBoolean(),
  check('productCategoryId').exists().isInt({ min: 1 }).toInt(),
  check('restaurantId').not().exists(),
  check('image').custom((value, { req }) => {
    return checkFileIsImage(req, 'image')
  }).withMessage('Please upload an image with format (jpeg, png).'),
  check('image').custom((value, { req }) => {
    return checkFileMaxSize(req, 'image', maxFileSize)
  }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
  check('restaurantId').not().exists(),
  // SOLUCIÓN
  check('fats').optional().isFloat({ min: 0 }).toFloat(),
  check('proteins').optional().isFloat({ min: 0 }).toFloat(),
  check('carbohydrates').optional().isFloat({ min: 0 }).toFloat(),
  check('calories').optional().isFloat({ min: 0 }).toFloat(),
  check('calories').custom(checkCalories).withMessage('Producto no puede contener más de 1000 calorías por 100g de producto')
]

export { create, update }
