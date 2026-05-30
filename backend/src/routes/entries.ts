import { Router, Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const entryValidation = [
  body('date').isISO8601().withMessage('Дата обязательна и должна быть в формате ISO'),
  body('workTypeId').isInt({ min: 1 }).withMessage('Вид работ обязателен'),
  body('volume').isFloat({ min: 0.01 }).withMessage('Объём должен быть положительным числом'),
  body('unit').trim().notEmpty().withMessage('Единица измерения обязательна'),
  body('executor').trim().notEmpty().withMessage('ФИО исполнителя обязательно'),
  body('notes').optional().trim(),
];

// GET /api/entries
router.get('/', async (req: Request, res: Response) => {
  try {
    const { dateFrom, dateTo, sortOrder = 'desc' } = req.query as {
      dateFrom?: string;
      dateTo?: string;
      sortOrder?: 'asc' | 'desc';
    };

    const where: Record<string, unknown> = {};
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) (where.date as Record<string, Date>).gte = new Date(dateFrom);
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        (where.date as Record<string, Date>).lte = to;
      }
    }

    const entries = await prisma.workEntry.findMany({
      where,
      include: { workType: true },
      orderBy: [{ date: sortOrder === 'asc' ? 'asc' : 'desc' }, { id: sortOrder === 'asc' ? 'asc' : 'desc' }],
    });

    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка получения записей' });
  }
});

// GET /api/entries/:id
router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params['id'] as string);
  const entry = await prisma.workEntry.findUnique({
    where: { id },
    include: { workType: true },
  });
  if (!entry) return res.status(404).json({ error: 'Запись не найдена' });
  return res.json(entry);
});

// POST /api/entries
router.post('/', entryValidation, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { date, workTypeId, volume, unit, executor, notes } = req.body;
    const entry = await prisma.workEntry.create({
      data: {
        date: new Date(date),
        workTypeId: parseInt(workTypeId),
        volume: parseFloat(volume),
        unit: unit.trim(),
        executor: executor.trim(),
        notes: notes?.trim() || null,
      },
      include: { workType: true },
    });
    return res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Ошибка создания записи' });
  }
});

// PUT /api/entries/:id
router.put('/:id', entryValidation, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = parseInt(req.params['id'] as string);
  try {
    const { date, workTypeId, volume, unit, executor, notes } = req.body;
    const entry = await prisma.workEntry.update({
      where: { id },
      data: {
        date: new Date(date),
        workTypeId: parseInt(workTypeId),
        volume: parseFloat(volume),
        unit: unit.trim(),
        executor: executor.trim(),
        notes: notes?.trim() || null,
      },
      include: { workType: true },
    });
    return res.json(entry);
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2025') {
      return res.status(404).json({ error: 'Запись не найдена' });
    }
    return res.status(500).json({ error: 'Ошибка обновления записи' });
  }
});

// DELETE /api/entries/:id
router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params['id'] as string);
  try {
    await prisma.workEntry.delete({ where: { id } });
    return res.status(204).send();
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2025') {
      return res.status(404).json({ error: 'Запись не найдена' });
    }
    return res.status(500).json({ error: 'Ошибка удаления записи' });
  }
});

export { router as entriesRouter };
