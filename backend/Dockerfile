FROM node:20-bullseye

# Add a fake DNS record to /etc/hosts
RUN echo "172.17.0.1   smtp.seznam.cz" >> /etc/hosts

CMD ["/bin/sh", "yarn prisma db push && node lib/cli"]