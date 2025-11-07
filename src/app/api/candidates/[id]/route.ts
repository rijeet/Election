import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import InfoCandidate from '@/models/InfoCandidate';

const UPLOAD_ROOT = path.join(process.cwd(), 'public', 'uploads', 'candidates');

const ensureAdminAuthorized = (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [adminId, timestamp] = decoded.split(':');
    return Boolean(adminId && timestamp);
  } catch (error) {
    console.error('Failed to validate admin token:', error);
    return false;
  }
};

const isFile = (value: FormDataEntryValue | null): value is File => {
  return value instanceof File && value.size > 0;
};

const saveUploadedFile = async (file: File, subDir = '') => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = path.extname(file.name) || '.jpg';
  const safeExt = ext.slice(0, 8);
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${safeExt}`;
  const targetDir = path.join(UPLOAD_ROOT, subDir);
  await fs.mkdir(targetDir, { recursive: true });
  const filePath = path.join(targetDir, filename);
  await fs.writeFile(filePath, buffer);
  const relativePath = path.join('/uploads/candidates', subDir, filename).replace(/\\/g, '/');
  return relativePath;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const candidate = await InfoCandidate.findOne({ id });
    
    if (!candidate) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(candidate);
  } catch (error) {
    console.error('Error fetching candidate:', error);
    return NextResponse.json(
      { error: 'Failed to fetch candidate' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!ensureAdminAuthorized(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { id } = await params;
    const contentType = request.headers.get('content-type') || '';
    let payload: Record<string, unknown> = {};
    let familyPayload: Record<string, unknown> | undefined;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const data = formData.get('data');

      if (!data || typeof data !== 'string') {
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
      }

      payload = JSON.parse(data);
      familyPayload = (payload.family as Record<string, unknown>) || undefined;

      const candidateImage = formData.get('candidateImage');
      if (isFile(candidateImage)) {
        payload.media = {
          ...(payload.media as Record<string, unknown>),
          img_url: await saveUploadedFile(candidateImage, 'profile')
        };
      }

      const spouseImage = formData.get('family_spouse_image');
      if (isFile(spouseImage)) {
        familyPayload = familyPayload || {};
        const spouse = (familyPayload.spouse as Record<string, unknown>) || {};
        spouse.img_url = await saveUploadedFile(spouseImage, 'family');
        familyPayload.spouse = spouse;
      }

      for (const [key, value] of formData.entries()) {
        if (!isFile(value)) continue;
        if (key.startsWith('family_sons_')) {
          const index = Number(key.replace('family_sons_', ''));
          if (!Number.isNaN(index) && familyPayload?.sons && Array.isArray(familyPayload.sons)) {
            const sons = familyPayload.sons as Array<Record<string, unknown>>;
            if (sons[index]) {
              sons[index].img_url = await saveUploadedFile(value, 'family');
            }
          }
        }
        if (key.startsWith('family_daughters_')) {
          const index = Number(key.replace('family_daughters_', ''));
          if (!Number.isNaN(index) && familyPayload?.daughters && Array.isArray(familyPayload.daughters)) {
            const daughters = familyPayload.daughters as Array<Record<string, unknown>>;
            if (daughters[index]) {
              daughters[index].img_url = await saveUploadedFile(value, 'family');
            }
          }
        }
      }
    } else {
      payload = await request.json();
      familyPayload = (payload.family as Record<string, unknown>) || undefined;
    }

    if (familyPayload) {
      payload.family = familyPayload;
    }

    const candidate = await InfoCandidate.findOneAndUpdate(
      { id },
      payload,
      { new: true, runValidators: true }
    );
    
    if (!candidate) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(candidate);
  } catch (error) {
    console.error('Error updating candidate:', error);
    return NextResponse.json(
      { error: 'Failed to update candidate' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!ensureAdminAuthorized(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { id } = await params;
    const candidate = await InfoCandidate.findOneAndDelete({ id });
    
    if (!candidate) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    return NextResponse.json(
      { error: 'Failed to delete candidate' },
      { status: 500 }
    );
  }
}
