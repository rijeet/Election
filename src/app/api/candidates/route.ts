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
  const safeExt = ext.slice(0, 8); // prevent very long extensions
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${safeExt}`;
  const targetDir = path.join(UPLOAD_ROOT, subDir);
  await fs.mkdir(targetDir, { recursive: true });
  const filePath = path.join(targetDir, filename);
  await fs.writeFile(filePath, buffer);
  const relativePath = path.join('/uploads/candidates', subDir, filename).replace(/\\/g, '/');
  return relativePath;
};

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const constituency = searchParams.get('constituency');
    const party = searchParams.get('party');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const query: Record<string, unknown> = {};
    
    if (constituency) {
      query.constituency = { $regex: constituency, $options: 'i' };
    }
    
    if (party) {
      query.party = { $regex: party, $options: 'i' };
    }
    
    if (search) {
      query.$or = [
        { candidate_name: { $regex: search, $options: 'i' } },
        { constituency: { $regex: search, $options: 'i' } },
        { party: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const candidates = await InfoCandidate.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ candidate_name: 1 });
    
    const total = await InfoCandidate.countDocuments(query);
    
    return NextResponse.json({
      candidates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch candidates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!ensureAdminAuthorized(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const contentType = request.headers.get('content-type') || '';
    let payload: Record<string, unknown> = {};
    const media: { img_url?: string } = {};
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
        media.img_url = await saveUploadedFile(candidateImage, 'profile');
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

    if (Object.keys(media).length > 0) {
      payload.media = { ...(payload.media as Record<string, unknown>), ...media };
    }

    if (familyPayload) {
      payload.family = familyPayload;
    }

    const candidate = new InfoCandidate(payload);
    await candidate.save();
    
    return NextResponse.json(candidate, { status: 201 });
  } catch (error) {
    console.error('Error creating candidate:', error);
    return NextResponse.json(
      { error: 'Failed to create candidate' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!ensureAdminAuthorized(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    await InfoCandidate.deleteMany({});
    
    return NextResponse.json({ message: 'All candidates deleted successfully' });
  } catch (error) {
    console.error('Error deleting candidates:', error);
    return NextResponse.json(
      { error: 'Failed to delete candidates' },
      { status: 500 }
    );
  }
}
