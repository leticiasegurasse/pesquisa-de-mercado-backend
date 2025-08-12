// middleware/validation.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';
import Joi from 'joi';

/**
 * ============================
 *        SCHEMAS JOI
 * ============================
 */

// Schema de validação para pesquisa de mercado
const pesquisaSchema = Joi.object({
  nome: Joi.string()
    .min(2)
    .max(255)
    .required()
    .messages({
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 255 caracteres',
      'any.required': 'Nome é obrigatório'
    }),

  whatsapp: Joi.string()
    .pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)
    .required()
    .messages({
      'string.pattern.base': 'WhatsApp deve estar no formato (11) 99999-9999',
      'any.required': 'WhatsApp é obrigatório'
    }),

  provedor_atual: Joi.string()
    .min(2)
    .max(255)
    .required()
    .messages({
      'string.min': 'Provedor atual deve ter pelo menos 2 caracteres',
      'string.max': 'Provedor atual deve ter no máximo 255 caracteres',
      'any.required': 'Provedor atual é obrigatório'
    }),

  satisfacao: Joi.string()
    .valid('Muito satisfeito', 'Satisfeito', 'Insatisfeito', 'Muito insatisfeito')
    .required()
    .messages({
      'any.only': 'Satisfação deve ser uma das opções válidas',
      'any.required': 'Satisfação é obrigatória'
    }),

  bairro: Joi.string()
    .min(2)
    .max(255)
    .required()
    .messages({
      'string.min': 'Bairro deve ter pelo menos 2 caracteres',
      'string.max': 'Bairro deve ter no máximo 255 caracteres',
      'any.required': 'Bairro é obrigatório'
    }),

  velocidade: Joi.string()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Velocidade deve ter no máximo 100 caracteres'
    }),

  valor_mensal: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.min': 'Valor mensal deve ter pelo menos 3 caracteres',
      'string.max': 'Valor mensal deve ter no máximo 100 caracteres',
      'any.required': 'Valor mensal é obrigatório'
    }),

  uso_internet: Joi.string()
    .min(5)
    .max(1000)
    .required()
    .messages({
      'string.min': 'Uso da internet deve ter pelo menos 5 caracteres',
      'string.max': 'Uso da internet deve ter no máximo 1000 caracteres',
      'any.required': 'Uso da internet é obrigatório'
    }),

  interesse_proposta: Joi.string()
    .valid('Sim, tenho interesse', 'Não tenho interesse')
    .required()
    .messages({
      'any.only': 'Interesse em proposta deve ser uma das opções válidas',
      'any.required': 'Interesse em proposta é obrigatório'
    })
});

// Schema para busca por bairro (query ou body, conforme uso)
const bairroSchema = Joi.object({
  bairro: Joi.string()
    .min(2)
    .max(255)
    .required()
    .messages({
      'string.min': 'Bairro deve ter pelo menos 2 caracteres',
      'string.max': 'Bairro deve ter no máximo 255 caracteres',
      'any.required': 'Bairro é obrigatório'
    })
});

// Schema para ID (params)
const idSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'ID deve ser um número',
      'number.integer': 'ID deve ser um número inteiro',
      'number.positive': 'ID deve ser positivo',
      'any.required': 'ID é obrigatório'
    })
});

/**
 * ============================
 *     MIDDLEWARES GENÉRICOS
 * ============================
 */

const joiOptions: Joi.ValidationOptions = {
  abortEarly: false,      // retorna todos os erros
  stripUnknown: true,     // remove campos não definidos no schema
  convert: true           // faz coerção quando aplicável
};

// Valida BODY (req.body)
export const validate = (schema: Joi.ObjectSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, joiOptions);
    if (error) {
      const errorMessage = error.details.map(d => d.message).join(', ');
      res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        error: errorMessage
      });
      return;
    }
    req.body = value as any;
    next();
  };
};

// Valida QUERY STRING (req.query)
export const validateQuery = (schema: Joi.ObjectSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, joiOptions);
    if (error) {
      const errorMessage = error.details.map(d => d.message).join(', ');
      res.status(400).json({
        success: false,
        message: 'Parâmetros de consulta inválidos',
        error: errorMessage
      });
      return;
    }
    req.query = value as any;
    next();
  };
};

// Valida PARAMS de rota (req.params)
export const validateParams = (schema: Joi.ObjectSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.params, joiOptions);
    if (error) {
      const errorMessage = error.details.map(d => d.message).join(', ');
      res.status(400).json({
        success: false,
        message: 'Parâmetros de rota inválidos',
        error: errorMessage
      });
      return;
    }
    req.params = value as any;
    next();
  };
};

/**
 * ============================
 *         EXPORTS
 * ============================
 */
export const schemas = {
  pesquisa: pesquisaSchema,
  bairro: bairroSchema,
  id: idSchema
};
