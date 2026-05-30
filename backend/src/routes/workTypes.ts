import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/work-types
router.get('/', async (_req: Request, res: Response) => {
  try {
    const workTypes = await prisma.workType.findMany({ orderBy: { name: 'asc' } });
    res.json(workTypes);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения видов работ' });
  }
});

// POST /api/work-types
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Название обязательно'),
    body('unit').trim().notEmpty().withMessage('Единица измерения обязательна'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const wt = await prisma.workType.create({
        data: { name: req.body.name.trim(), unit: req.body.unit.trim() },
      });
      return res.status(201).json(wt);
    } catch (err: unknown) {
      if ((err as { code?: string }).code === 'P2002') {
        return res.status(409).json({ error: 'Вид работ с таким названием уже существует' });
      }
      return res.status(500).json({ error: 'Ошибка создания вида работ' });
    }
  }
);

// DELETE /api/work-types/:id
router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params['id'] as string);
  try {
    await prisma.workType.delete({ where: { id } });
    return res.status(204).send();
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2025') {
      return res.status(404).json({ error: 'Вид работ не найден' });
    }
    if ((err as { code?: string }).code === 'P2003') {
      return res.status(409).json({ error: 'Нельзя удалить вид работ, который используется в записях' });
    }
    return res.status(500).json({ error: 'Ошибка удаления вида работ' });
  }
});

export { router as workTypesRouter };
