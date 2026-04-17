import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GamesService } from '../games/games.service';
import { ListReviewsDto } from './dto/list-reviews.dto';
import { UpsertReviewDto } from './dto/upsert-review.dto';
import { ReviewsRepository } from './reviews.repository';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly gamesService: GamesService,
  ) {}

  async create(userId: number, upsertReviewDto: UpsertReviewDto) {
    const game = await this.gamesService.findById(upsertReviewDto.jogoId);
    if (!game) {
      throw new NotFoundException('Jogo nÃ£o encontrado.');
    }

    const existingReview = await this.reviewsRepository.findByUserAndGame(
      userId,
      upsertReviewDto.jogoId,
    );
    if (existingReview) {
      throw new ConflictException('VocÃª jÃ¡ avaliou este jogo.');
    }

    const review = await this.reviewsRepository.create({
      fkUsuario: userId,
      fkJogo: upsertReviewDto.jogoId,
      nota: upsertReviewDto.nota,
      comentario: upsertReviewDto.comentario ?? '',
    });

    return {
      message: 'AvaliaÃ§Ã£o criada com sucesso!',
      avaliacao: review,
    };
  }

  async update(userId: number, upsertReviewDto: UpsertReviewDto) {
    const game = await this.gamesService.findById(upsertReviewDto.jogoId);
    if (!game) {
      throw new NotFoundException('Jogo nÃ£o encontrado.');
    }

    const existingReview = await this.reviewsRepository.findByUserAndGame(
      userId,
      upsertReviewDto.jogoId,
    );
    if (!existingReview) {
      throw new NotFoundException('AvaliaÃ§Ã£o nÃ£o encontrada para este jogo.');
    }

    const normalizedComment = upsertReviewDto.comentario ?? '';
    if (
      existingReview.nota === upsertReviewDto.nota &&
      (existingReview.comentario ?? '') === normalizedComment
    ) {
      throw new BadRequestException('Nenhuma alteraÃ§Ã£o foi feita na avaliaÃ§Ã£o.');
    }

    await this.reviewsRepository.update(existingReview.id, {
      nota: upsertReviewDto.nota,
      comentario: normalizedComment,
    });

    return { message: 'AvaliaÃ§Ã£o atualizada com sucesso!' };
  }

  async findAll(userId: number, listReviewsDto: ListReviewsDto) {
    if (listReviewsDto.jogoId) {
      return this.reviewsRepository.findByUserAndGame(userId, listReviewsDto.jogoId);
    }

    return this.reviewsRepository.findByUser(userId);
  }

  async findAverageByGame(gameId: number) {
    const reviews = await this.reviewsRepository.findByGame(gameId);
    if (reviews.length === 0) {
      return null;
    }

    const sum = reviews.reduce((accumulator, review) => accumulator + review.nota, 0);
    const average = Number((sum / reviews.length).toFixed(2));

    return {
      media: average,
      totalAvaliacoes: reviews.length,
      avaliacoes: reviews,
    };
  }
}


