import express from "express";
import { prisma } from "./db";
import {
  createAvailabilitySchema,
  createServiceSchema,
  getServiceSchema,
  getSlotSchema,
  signinSchema,
  signupSchema,
  zodErrorMessage,
} from "./validation";
import { hash, compare } from "bcrypt";
import { generateToken } from "./token";
import { auth, rbac } from "./middleware";

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/auth/register", async (req, res) => {
  const { success, data, error } = signupSchema.safeParse(req.body);

  if (!success) {
    console.log("zod error ", zodErrorMessage({ error }));
    return res.status(400).json({
      message: "invalid inptuts",
    });
  }

  const { name, email, password, role } = data;

  const existingUser = await prisma.user.findFirst({
    where: { email },
  });

  if (existingUser) {
    return res.status(409).json({
      message: "duplicate email",
    });
  }

  const hashedPassword = await hash(password, 4);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role,
    },
  });

  return res.status(201).json({
    message: `User created Successfully with id ${user.id}`,
  });
});

app.post("/auth/register", async (req, res) => {
  const { success, data, error } = signinSchema.safeParse(req.body);

  if (!success) {
    console.log("zod error ", zodErrorMessage({ error }));
    return res.status(400).json({
      message: "invalid inptuts",
    });
  }

  const { email, password } = data;

  const existingUser = await prisma.user.findFirst({
    where: { email },
  });

  if (!existingUser) {
    return res.status(404).json({
      message: "user not found",
    });
  }

  const hashedPassword = await compare(password, existingUser.password);

  if (!hashedPassword) {
    return res.status(401).json({
      message: "invalid credentials",
    });
  }

  const token = generateToken({
    userId: existingUser.id,
    role: existingUser.role,
  });

  return res.status(200).json({
    token,
  });
});

app.post("/services", auth, rbac("SERVICE_PROVIDER"), async (req, res) => {
  const { userId } = req.user;
  const { success, data, error } = createServiceSchema.safeParse(req.body);

  if (!success) {
    console.log("zod error ", zodErrorMessage({ error }));
    return res.status(400).json({
      message: "invalid inptuts",
    });
  }

  const { durationInMinutes, name, type } = data;

  const service = await prisma.service.create({
    data: {
      durationInMinutes,
      name,
      type,
      providerId: userId,
    },
  });

  return res.status(201).json({
    id: service.id,
    name: service.name,
    type: service.type,
    durationMinutes: service.durationInMinutes,
  });
});

app.post(
  "/services/:serviceId/availability",
  auth,
  rbac("SERVICE_PROVIDER"),
  async (req, res) => {
    const { userId } = req.user;
    const { success, data, error } = createAvailabilitySchema.safeParse({
      ...req.body,
      ...req.params,
    });

    if (!success) {
      console.log("zod error ", zodErrorMessage({ error }));
      return res.status(400).json({
        message: "invalid inputs",
      });
    }

    const { daysOfWeek, endTime, serviceId, startTime } = data;

    const service = await prisma.service.findFirst({
      where: { id: serviceId, providerId: userId },
    });

    if (!service) {
      return res.status(404).json({
        message: "service not found",
      });
    }

    const existingAvailability = await prisma.availability.findFirst({
      where: {
        daysOfWeek: Number(daysOfWeek),
        endTime,
        startTime,
        serviceId: service.id,
      },
    });

    if (existingAvailability) {
      return res.status(409).json({
        message: "availability overlapping",
      });
    }

    await prisma.availability.create({
      data: {
        daysOfWeek: Number(daysOfWeek),
        endTime,
        startTime,
        serviceId: service.id,
      },
    });

    return res.status(201).json({
      message: "availability created",
    });
  },
);

// ?type="MEDICAL"
app.get("/services", auth, async (req, res) => {
  const { success, data, error } = getServiceSchema.safeParse(req.query);

  if (!success) {
    console.log("zod error ", zodErrorMessage({ error }));
    return res.status(400).json({
      message: "invalid inputs",
    });
  }

  const { type } = data;

  const services = await prisma.service.findMany({
    where: {
      type,
    },
    include: {
      provider: {
        select: {
          name: true,
        },
      },
    },
  });

  return res.status(200).json({ services });
});

// ?date=YYYY-MM-DD
app.get("/services/:serviceId/slots", auth, async (req, res) => {
  const { success, data, error } = getSlotSchema.safeParse(req.query);

  if (!success) {
    console.log("zod error ", zodErrorMessage({ error }));
    return res.status(400).json({
      message: "invalid inputs",
    });
  }

  const { date, serviceId } = data;

  const services = await prisma.availability.findMany({
    where: {
      serviceId,
    },
  });
})

app.listen(PORT, () => console.log("code is running at, ", PORT));
