import { IsString } from 'class-validator';

class LogInDto {
  @IsString()
  public email: String;

  @IsString()
  public password: String;
}

export default LogInDto;