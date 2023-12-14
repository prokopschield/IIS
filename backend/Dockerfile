FROM node:20-bullseye

RUN apt update
RUN apt upgrade -y
RUN apt install -y vim

CMD ["/bin/sh", "-c", "yarn prisma db push && node lib/cli"]
