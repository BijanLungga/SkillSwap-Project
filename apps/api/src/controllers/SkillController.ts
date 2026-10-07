import { Request, Response } from 'express';
import * as SkillService from '../services/SkillService';

export const getUserSkills = async (req: Request, res: Response) => {
  try {
    const skills = await SkillService.getUserSkills(req.params.id);
    res.json({ success: true, data: skills });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const addSkill = async (req: Request, res: Response) => {
  try {
    const { skillName, skillType } = req.body;
    if (!skillName || !skillType) {
      return res.status(400).json({ success: false, error: 'Nama keahlian dan tipe wajib diisi' });
    }
    const skill = await SkillService.addSkill(req.params.id, skillName, skillType);
    res.json({ success: true, data: skill });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteSkill = async (req: Request, res: Response) => {
  try {
    await SkillService.deleteSkill(req.params.id);
    res.json({ success: true, data: null, message: 'Keahlian berhasil dihapus' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
